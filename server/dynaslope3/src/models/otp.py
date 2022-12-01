"""
File containing class representation of
tables of users
"""

from flask_login import UserMixin
from marshmallow import fields, EXCLUDE
from instance.config import SCHEMA_DICT
from connection import DB, MARSHMALLOW
from src.models.sites import Sites
from src.models.organizations import UserOrganizations, UserOrganizationsSchema


class ForgotPasswordPending(DB.Model, UserMixin):
    """
    Class representation of users table
    """

    __tablename__ = "forgot_password_pending"
    __bind_key__ = "commons_db"
    __table_args__ = {"schema": SCHEMA_DICT[__bind_key__]}

    id = DB.Column(DB.Integer, primary_key=True)
    user_id = DB.Column(
        DB.Integer, DB.ForeignKey(f"{SCHEMA_DICT['commons_db']}.users.user_id"))
    OTP = DB.Column(DB.String(45))
    validity = DB.Column(DB.Boolean, default=False)

class ForgotPasswordPendingSchema(MARSHMALLOW.SQLAlchemyAutoSchema):
    """
    Schema representation of Users class
    """
    
    class Meta:
        """Saves table class structure as schema model"""
        model = ForgotPasswordPending
        unknown = EXCLUDE
        # NOTE EXCLUDE
        # exclude = [
        #     "mobile_numbers", "landline_numbers", "account",
        #     "marker_tags", "rainfall_tags", "issue_and_reminder"
        # ]