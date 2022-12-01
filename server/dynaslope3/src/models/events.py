
"""
"""

from instance.config import SCHEMA_DICT
from marshmallow import fields
from connection import DB, MARSHMALLOW

class Activity(DB.Model):
    """
    Class representation of activity table
    """

    __tablename__ = "activity"
    __bind_key__ = "commons_db"
    __table_args__ = {"schema": SCHEMA_DICT[__bind_key__]}

    activity_id = DB.Column(DB.Integer, primary_key=True)
    start_date = DB.Column(DB.String(100))
    end_date = DB.Column(DB.String(50))
    activity_name = DB.Column(DB.String(100))
    activity_place = DB.Column(DB.String(100))
    activity_note = DB.Column(DB.String(300))
    file_name = DB.Column(DB.String(100))
    issuer_id = DB.Column(DB.Integer())

    def __repr__(self):
        return (f"Type <{self.__class__.__name__}> activity_id: {self.activity_id}")


class ActivitySchema(MARSHMALLOW.SQLAlchemyAutoSchema):
    """
    Schema representation of Activity class
    """

    class Meta:
        """Saves table class structure as schema model"""
        model = Activity