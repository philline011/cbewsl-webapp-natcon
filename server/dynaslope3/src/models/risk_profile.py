from flask_login import UserMixin
from marshmallow import fields, EXCLUDE
from instance.config import SCHEMA_DICT
from connection import DB, MARSHMALLOW
from src.models.sites import Sites
from src.models.organizations import UserOrganizations, UserOrganizationsSchema


class RiskProfile(DB.Model, UserMixin):
    """
    Class representation of users table
    """

    __tablename__ = "risk_profile"
    __bind_key__ = "commons_db"
    __table_args__ = {"schema": SCHEMA_DICT[__bind_key__]}

    id = DB.Column(DB.Integer, primary_key=True)
    household_id = DB.Column(DB.String(15))
    first_name = DB.Column(DB.String(45))
    last_name = DB.Column(DB.String(45))
    disability = DB.Column(DB.Integer, nullable=True)
    birthdate = DB.Column(DB.Date)
    pregnant = DB.Column(DB.Integer, nullable=True)
    other_disability = DB.Column(DB.String(45))
    gender = DB.Column(DB.String(45))
    updated_by = DB.Column(DB.String(45))
    updated_at = DB.Column(DB.Date)

class RiskProfileSchema(MARSHMALLOW.SQLAlchemyAutoSchema):
    """
    Schema representation of Users class
    """
    class Meta:
        """Saves table class structure as schema model"""
        model = RiskProfile
        unknown = EXCLUDE

class RiskProfileMember(DB.Model, UserMixin):
    """
    Class representation of users table
    """

    __tablename__ = "riskprofile_members"
    __bind_key__ = "commons_db"
    __table_args__ = {"schema": SCHEMA_DICT[__bind_key__]}

    id = DB.Column(DB.Integer, primary_key=True)
    riskprofile_id = DB.Column(DB.Integer)
    first_name = DB.Column(DB.String(45))
    last_name = DB.Column(DB.String(45))
    disability = DB.Column(DB.Integer, nullable=True)
    birthdate = DB.Column(DB.Date)
    pregnant = DB.Column(DB.Integer, nullable=True)
    other_disability = DB.Column(DB.String(45))
    gender = DB.Column(DB.String(45))

class RiskProfileMemberSchema(MARSHMALLOW.SQLAlchemyAutoSchema):
    """
    Schema representation of Users class
    """
    class Meta:
        """Saves table class structure as schema model"""
        model = RiskProfileMember
        unknown = EXCLUDE