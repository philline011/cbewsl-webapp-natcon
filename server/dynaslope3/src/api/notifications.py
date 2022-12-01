"""
Narratives functions API File
"""

from src.models.users import Designation
from flask import Blueprint, request, jsonify
from sqlalchemy import desc

from src.utils.notifications import set_all_unseen_notifications, update_ts_read
from src.models.users import Users, UserProfile, UsersSchema, UserProfileSchema, UserEmails
from src.models.notifications import Notifications, NotificationsSchema
from src.models.mobile_devices import MobileDevices, MobileDevicesSchema
from connection import DB
from src.utils.extra import var_checker
from datetime import datetime, timedelta
from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError,
    PushTicketError,
)
from requests.exceptions import ConnectionError, HTTPError
import sys
sys.setrecursionlimit(30000)
from threading import Timer
import time


NOTIFICATIONS_BLUEPRINT = Blueprint("notifications_blueprint", __name__)

@NOTIFICATIONS_BLUEPRINT.route(
    "/notifications/set_all_seen_notifications", methods=["POST"])
def wrap_set_all_unseen_notifications():
    """
    Deletes specific narrative.
    """

    json_data = request.get_json()
    status = set_all_unseen_notifications(json_data["user_id"])

    return status


@NOTIFICATIONS_BLUEPRINT.route(
    "/notifications/update_ts_read", methods=["POST"])
def wrap_update_ts_read():
    """
    Update ts_read of a certain notification
    """

    json_data = request.get_json()
    status = update_ts_read(
        json_data["user_id"], json_data["notification_id"], json_data["ts_read"])

    return status

def test():
    return true

@NOTIFICATIONS_BLUEPRINT.route("/notifications/send_notification", methods=["POST", "GET"])
def send(data=None):
    if data == None:
        data = request.get_json()
        recipient = Users.query.filter(Users.user_id == data['recipient_id']).first()
        sender = Users.query.filter(Users.user_id == data['sender_id']).first()
        sender_profile = UserProfile.query.filter(UserProfile.user_id == data['sender_id']).first()
        designation = Designation.query.filter(Designation.id == sender_profile.designation_id).first()
    else:
        sender = Users.query.filter(Users.user_id == data['sender_id']).first()
        sender_profile = UserProfile.query.filter(UserProfile.user_id == data['sender_id']).first()
        designation = Designation.query.filter(Designation.id == sender_profile.designation_id).first()

    if data['code'] == "chat":
        notif = Notifications(
            ts=datetime.now(),
            receiver_id=data['recipient_id'],
            message=f"{designation.designation} {sender.first_name} sent you a message!",
            link=None,
            ts_read=datetime.now(),
            ts_seen=None,
            category="chat"
        )
        DB.session.add(notif)
        DB.session.commit()

        if data['is_logged_in'] == False:
            device = MobileDevices.query.filter(MobileDevices.user_id == data['recipient_id']).first()
            if device is not None:
                send_push_message(device.device_id, f"{designation.designation} {sender.first_name} sent you a message!")
    elif data['code'] == "ewi_ack":
        notif = Notifications(
            ts=datetime.now(),
            receiver_id=data['recipient_id'],
            message=f"{designation.designation} {data['msg']}",
            link=None,
            ts_read=datetime.now(),
            ts_seen=None,
            category="ewi_ack"
        )
        DB.session.add(notif)
        DB.session.commit()
    elif data['code'] == "ewi_disseminate":
        notif = Notifications(
            ts=datetime.now(),
            receiver_id=data['recipient_id'],
            message=f"{designation.designation} {sender.first_name} sent you an EWI!",
            link=None,
            ts_read=datetime.now(),
            ts_seen=None,
            category="ewi_disseminate"
        )
        DB.session.add(notif)
        DB.session.commit()
        if data['is_logged_in'] == False:
            
            device = MobileDevices.query.filter(MobileDevices.user_id == data['recipient_id']).first()
            
            if device is not None:
                send_push_message(device.device_id, f"{designation.designation} {sender.first_name} sent an EWI!")
    else:
        print("OTHER NOTIF GOES HERE")
    return jsonify({"status": True})

@NOTIFICATIONS_BLUEPRINT.route("/notifications/read_notification/<notification_id>", methods=["GET"])
def read_notification(notification_id):
    try:
        notifications = Notifications.query.filter(Notifications.notification_id == notification_id).first()
        notifications.is_read = True
        DB.session.commit()
        return jsonify({"status": True})
    except Exception as err:
        print(err)
        return jsonify({"status": False})

@NOTIFICATIONS_BLUEPRINT.route("/notifications/<user_id>", methods=["GET"])
def fetch_notification(user_id):
    try:
        return_val = list()
        notifications = Notifications.query.filter(Notifications.receiver_id == user_id).order_by(desc(Notifications.ts)).all()
        for notif in notifications:
            notification = NotificationsSchema().dump(notif)
            return_val.append(notification)
        return jsonify({"status": True, "data": return_val})
    except Exception as err:
        print(err)
        return jsonify({"status": False})

def send_push_message(token, message, extra=None):
    try:
        response = PushClient().publish(
            PushMessage(to=token,
                        body=message,
                        data=extra))
    except PushServerError as exc:
        # rollbar.report_exc_info(
        #     extra_data={
        #         'token': token,
        #         'message': message,
        #         'extra': extra,
        #         'errors': exc.errors,
        #         'response_data': exc.response_data,
        #     })
        raise
    except (ConnectionError, HTTPError) as exc:
        # rollbar.report_exc_info(
        #     extra_data={'token': token, 'message': message, 'extra': extra})
        raise self.retry(exc=exc)

    # try:
    #     print(response.validate_response())
    # except DeviceNotRegisteredError:
    #     from notifications.models import PushToken
    #     PushToken.objects.filter(token=token).update(active=False)
    except PushTicketError as exc:
        # rollbar.report_exc_info(
        #     extra_data={
        #         'token': token,
        #         'message': message,
        #         'extra': extra,
        #         'push_response': exc.push_response._asdict(),
        #     })
        raise self.retry(exc=exc)
