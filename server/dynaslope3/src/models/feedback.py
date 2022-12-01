
"""
"""

from instance.config import SCHEMA_DICT
from marshmallow import fields
from connection import DB, MARSHMALLOW

class Feedback(DB.Model):
    """
    Class representation of feedback table
    """

    __tablename__ = "feedback"
    __bind_key__ = "commons_db"
    __table_args__ = {"schema": SCHEMA_DICT[__bind_key__]}

    feedback_id = DB.Column(DB.Integer, primary_key=True)
    issue = DB.Column(DB.String(50))
    concern = DB.Column(DB.String(300))
    other_concern = DB.Column(DB.String(100))
    file_name = DB.Column(DB.String(100))

    def __repr__(self):
        return (f"Type <{self.__class__.__name__}> feedback_id: {self.feedback_id}")


class FeedbackSchema(MARSHMALLOW.SQLAlchemyAutoSchema):
    """
    Schema representation of Activity class
    """

    class Meta:
        """Saves table class structure as schema model"""
        model = Feedback