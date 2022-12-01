"""
Users Functions Controller File
"""

from flask import Blueprint, jsonify, request
from connection import DB
from src.models.communications import Chats, ChatsSchema, Chatrooms, ChatroomsSchema
from src.models.users import Designation
from src.models.users import Users, UsersSchema, UserProfile
from src.models.monitoring import MonitoringReleasesAcknowledgment
from datetime import datetime, timedelta
from src.utils.contacts import get_mobile_numbers
import time
from src.api.notifications import send

MESSENGER_BLUEPRINT = Blueprint("messenger_blueprint", __name__)


@MESSENGER_BLUEPRINT.route("/get_recipient_room/<recipient_id>/<sender_id>", methods=["GET"])
def get_recipient_room(recipient_id, sender_id):
    try:
        previous_chats = Chats.query.filter(DB.and_(Chats.recipient_user_id == recipient_id, Chats.sender_user_id == sender_id)).all()
        if len(previous_chats) > 0:
            for chat in previous_chats:
                room_id = chat.room_id # Return last id for now
            return get_conversations(room_id)
        else:
            room_id = create_chatroom(sender_id, recipient_id)

            is_added, res = add_chat(room_id, {
                        "sender_user_id": sender_id,
                        "recipient_user_id": recipient_id,
                        "msg": "Hi! Let's chat.",
                        "room_id": room_id
                    })
            if is_added != False:
                return jsonify({"status": True, "res": res})
            else:
                return jsonify({"status": False})
    except Exception as e:
        print(e)
        return jsonify({"status": False})

@MESSENGER_BLUEPRINT.route("/contacts", methods=["GET"])
def get_contacts():
    try:
        ret_val = list()
        temp = get_mobile_numbers(return_schema=True)
        for contact in temp:
            temporary = contact

            sender_profile = UserProfile.query.filter(UserProfile.user_id == contact['user']['user_id']).first()
            designation = Designation.query.filter(Designation.id == sender_profile.designation_id).first()

            temporary['user']['designation'] = designation.designation

            ret_val.append(temporary)
        return_obj = {
            "status": True,
            "data": ret_val
        }
        return jsonify(return_obj)
    except Exception as e:
        print(e)
        return jsonify({"status": False})


@MESSENGER_BLUEPRINT.route("/get_conversations/<room_id>", methods=["GET"])
def get_conversations(room_id):
    try:
        chats = Chats.query.filter(Chats.room_id == room_id).order_by(Chats.id.asc()).all()
        chat_list = list()
        for chat in chats:
            temp = ChatsSchema().dump(chat)
            user = Users.query.filter(Users.user_id == temp['sender_user_id']).first()
            sender_profile = UserProfile.query.filter(UserProfile.user_id == temp['sender_user_id']).first()
            designation = Designation.query.filter(Designation.id == sender_profile.designation_id).first()
            temp['source'] = f"{designation.designation} {user.first_name} {user.last_name}"
            chat_list.append(temp)
        return_obj = {
            "status": True,
            "title": "Fetched chats",
            "data": chat_list
        }
        return jsonify(return_obj)
    except Exception as e:
        print(e)
        return jsonify({"status": False})

@MESSENGER_BLUEPRINT.route("/get_rooms/<creator_id>", methods=["GET"])
def get_rooms(creator_id):
    try:
        rooms = Chatrooms.query.filter(Chatrooms.creator_user_id == creator_id).all()
        room_list = list()
        for room in rooms:
            temp = ChatroomsSchema().dump(room)
            chat = Chats.query.filter(Chats.room_id == temp['id']).order_by(Chats.id.asc()).first()
            temp['last_ts'] = chat.ts
            temp['last_msg'] = chat.msg
            temp['room_name'] = f"{temp['room_name']}"
            
            room_list.append(temp)
        associated_rooms = get_rooms_association(creator_id, room_list)
        return_obj = {
            "status": True,
            "title": "Fetched rooms",
            "data": room_list+associated_rooms
        }

        return jsonify(return_obj)
    except Exception as e:
        print(e)
        return jsonify({"status": False})

def get_rooms_association(user_id, room_list):
    association_list = list()
    room_associations = Chats.query.filter(Chats.recipient_user_id == user_id).group_by(Chats.room_id).all()
    for room in room_associations:
        chatroom = Chatrooms.query.filter(Chatrooms.id == room.room_id).first()
        chat = Chats.query.filter(Chats.room_id == room.room_id).order_by(Chats.id.desc()).first()
        user = Users.query.filter(Users.user_id == room.sender_user_id).first()
        if len(room_list) == 0:
            association_list.append({
                "creator_user_id": chatroom.creator_user_id,
                "last_msg": chat.msg,
                "last_ts": chat.ts,
                "ts_created": chatroom.ts_created,
                "room_name": f"{user.first_name} {user.last_name}",
                "id": chatroom.id
            })
        else:
            if any(obj['id'] != chatroom.id for obj in room_list):
                association_list.append({
                    "creator_user_id": chatroom.creator_user_id,
                    "last_msg": chat.msg,
                    "last_ts": chat.ts,
                    "ts_created": chatroom.ts_created,
                    "room_name": f"{user.first_name} {user.last_name}",
                    "id": chatroom.id
                })
            
    return association_list


@MESSENGER_BLUEPRINT.route("/send", methods=["POST"])
def insert_chat():
    try:
        data = request.get_json()
        if data['room_id'] == None:
            room_id = create_chatroom(data["sender_user_id"],data["recipient_user_id"])
        else:
            room_id = data['room_id']
            
        
        is_added, res = add_chat(room_id, data)
        if is_added != False:
            return jsonify({"status": True, "res": res})
        else:
            return jsonify({"status": False})
    except Exception as e:
        print(e)
        return jsonify({"status": False})

def create_chatroom(creator_id, recipient_user_id):
    try:
        recipient = Users.query.filter(Users.user_id == recipient_user_id).first()
        room = Chatrooms(
            room_name=f"{recipient.first_name} {recipient.last_name}",
            ts_created=datetime.now(),
            creator_user_id=creator_id
        )
        DB.session.add(room)
        DB.session.flush()
        DB.session.commit()
        return room.id
    except Exception as e:
        return None

def add_chat(room_id, data):
    try:
        chat = Chats(
            room_id=int(room_id),
            msg=str(data['msg']),
            ts=datetime.now(),
            ts_seen=None,
            sender_user_id=str(data['sender_user_id']),
            recipient_user_id=str(data['recipient_user_id'])
        )
        DB.session.add(chat)
        DB.session.flush()
        DB.session.commit()
        ret_val = ChatsSchema().dump(chat)
        user = Users.query.filter(Users.user_id == ret_val['sender_user_id']).first()
        ret_val['source'] = f"{user.first_name} {user.last_name}"
        return chat.id, ret_val
    except Exception as e:
        print(e)
        return False

@MESSENGER_BLUEPRINT.route("/get_all_users", methods=["GET"])
def get_all_users():
    users = Users.query.all()
    all_users = []
    for user in users:
        name = f'{user.last_name}, {user.first_name}'
        user_id = user.user_id
        user_info = {
            "name": name,
            "user_id": user_id
        }
        all_users.append(user_info)

    return jsonify(all_users)


@MESSENGER_BLUEPRINT.route("/send_ewi", methods=["GET", "POST"])
def send_ewi():
    data = request.get_json()
    print(data)
    sender_id = data["sender_user_id"]
    recipient_ids = data["recipient_user_ids"]
    release_id = data["release_id"]
    release_details = data["release_details"]
    status = None
    feedback = None
    try:
        for recipient_id in recipient_ids:
            check_existing_chat = Chats.query.filter(Chats.sender_user_id == sender_id, Chats.recipient_user_id == recipient_id).first()
            room_id = None
            if check_existing_chat:
                room_id = check_existing_chat.room_id

            if room_id == None:
                room_id = create_chatroom(sender_id,recipient_id)

            data = {
                "msg": data["msg"],
                "sender_user_id": sender_id,
                "recipient_user_id": recipient_id
            }
            add_chat(room_id, data)
            ack = MonitoringReleasesAcknowledgment(
                release_id=release_id,
                recipient_id=recipient_id,
                is_acknowledge=False,
                release_details=release_details,
                issuer_id=sender_id
            )
            DB.session.add(ack)

            data = {
                'code': 'ewi_disseminate',
                'recipient_id': ack.recipient_id,
                'sender_id': ack.issuer_id,
                'msg': data["msg"],
                'is_logged_in': False
            }
            # need alisin ito kasi nag i-stack overflow
            send(data) 
    
        DB.session.commit()
        feedback = "Warning dissemination successful."
        status = True
        # for recipient_id in recipient_ids:
        #     data = {
        #         'code': 'ewi_disseminate',
        #         'recipient_id': 4,
        #         'sender_id': sender_id,
        #         'msg': data["msg"],
        #         'is_logged_in': False
        #     }
        # from src.api.notifications import send
        # print("----------------------")
        # print(data)
        # print("----------------------")
        # send(data)

        

    except Exception as err:
        DB.session.rollback()
        feedback = f"ERROR: {err}, Please contact the developers."
        status = False


    return_data = {
        "status": status,
        "feedback": feedback
    }
    return jsonify(return_data)
