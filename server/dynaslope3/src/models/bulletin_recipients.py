"""
File containing class representation of
Bulletin recipients tables
"""

from instance.config import SCHEMA_DICT
from connection import DB, MARSHMALLOW


class BulletinRecipients(DB.Model):
    """
    Class representation of bulletin_recipients table
    """

    __tablename__ = "bulletin_recipients"
    __bind_key__ = "comms_db_3"
    __table_args__ = {"schema": SCHEMA_DICT[__bind_key__]}

    recipient_id = DB.Column(DB.Integer, primary_key=True, nullable=False)
    email_address = DB.Column(DB.String(255), nullable=False)
    recipient_group = DB.Column(DB.String(45), nullable=False)

    def __repr__(self):
        return (f"Type <{self.__class__.__name__}> Recipient ID: {self.recpient_id}"
                f" Email: {self.email_address} Group: {self.recipient_group}")


class BulletinRecipientsSchema(MARSHMALLOW.SQLAlchemyAutoSchema):
    """
    Schema representation of Monitoring Events class
    """

    class Meta:
        """Saves table class structure as schema model"""
        model = BulletinRecipients
