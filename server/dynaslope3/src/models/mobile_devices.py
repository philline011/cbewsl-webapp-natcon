"""
File containing class representation of
Membership table (and related tables)
"""

from flask_login import UserMixin
from connection import DB, MARSHMALLOW


class MobileDevices(UserMixin, DB.Model):
    """
    Class representation of Membership table
    """

    __tablename__ = "expo_mobile_devices"
    ###
    # __bind_key__ contains database name to access
    # Not necessary if "senslopedb" because it is the default one
    ###
    __bind_key__ = "commons_db"

    id = DB.Column(DB.Integer, primary_key=True)
    user_id = DB.Column(DB.String(45))
    device_id = DB.Column(DB.String(499))


class MobileDevicesSchema(MARSHMALLOW.SQLAlchemyAutoSchema):
    """
    Schema representation of Membership class
    """
    class Meta:
        """Saves table class structure as schema model"""
        model = MobileDevices
