
"""
"""

from instance.config import SCHEMA_DICT
from marshmallow import fields
from connection import DB, MARSHMALLOW

class Chats(DB.Model):
    """
    Class representation of activity table
    """

    __tablename__ = "chats"
    __bind_key__ = "comms_db_3"
    __table_args__ = {"schema": SCHEMA_DICT[__bind_key__]}

    id = DB.Column(DB.Integer, primary_key=True)
    room_id = DB.Column(DB.Integer)
    msg = DB.Column(DB.String(255))
    ts = DB.Column(DB.DateTime)
    ts_seen = DB.Column(DB.DateTime)
    sender_user_id = DB.Column(DB.Integer)
    recipient_user_id = DB.Column(DB.Integer)


class ChatsSchema(MARSHMALLOW.SQLAlchemyAutoSchema):
    """
    Schema representation of Activity class
    """

    class Meta:
        """Saves table class structure as schema model"""
        model = Chats

class Chatrooms(DB.Model):
    """
    Class representation of activity table
    """

    __tablename__ = "chatrooms"
    __bind_key__ = "comms_db_3"
    __table_args__ = {"schema": SCHEMA_DICT[__bind_key__]}

    id = DB.Column(DB.Integer, primary_key=True)
    room_name = DB.Column(DB.String(100))
    ts_created = DB.Column(DB.DateTime)
    creator_user_id = DB.Column(DB.Integer)


class ChatroomsSchema(MARSHMALLOW.SQLAlchemyAutoSchema):
    """
    Schema representation of Activity class
    """

    class Meta:
        """Saves table class structure as schema model"""
        model = Chatrooms