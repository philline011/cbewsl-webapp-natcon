"""
File containing class representation of
Time Logs table
"""

import datetime
from marshmallow import fields, EXCLUDE, Schema
from instance.config import SCHEMA_DICT
from connection import DB, MARSHMALLOW


class TimeLogs(DB.Model):
    """
    Class representation of monitoring_events table
    """

    __tablename__ = "time_logs"
    __bind_key__ = "commons_db"
    __table_args__ = {"schema": SCHEMA_DICT[__bind_key__]}

    id = DB.Column(DB.Integer, primary_key=True, nullable=False)
    user_id = DB.Column(DB.Integer, DB.ForeignKey(
        f"{SCHEMA_DICT['commons_db']}.users.user_id"), nullable=False)
    action = DB.Column(DB.String(255), nullable=False)
    actual_ts = DB.Column(DB.DateTime)
    mia_ts = DB.Column(DB.DateTime)

    def __repr__(self):
        return (f"Type <{self.__class__.__name__}> ID: {self.id}"
                f" User ID: {self.user_id} Actions: {self.action}"
                f" TS: {self.ts}")


class TimeLogssSchema(MARSHMALLOW.SQLAlchemyAutoSchema):
    """
    Schema representation of Monitoring Events class
    """
    user_id = fields.Integer()
    ts = fields.DateTime("%Y-%m-%d %H:%M:%S")

    class Meta:
        """Saves table class structure as schema model"""
        model = TimeLogs
