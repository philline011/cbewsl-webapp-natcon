from instance.config import SCHEMA_DICT
from marshmallow import fields
from connection import DB, MARSHMALLOW

class HouseholdData(DB.Model):
    __tablename__ = "household_data"
    __bind_key__ = "commons_db"
    __table_args__ = {"schema": SCHEMA_DICT[__bind_key__]}

    id = DB.Column(DB.Integer, primary_key=True)
    household_id = DB.Column(DB.String(65))
    household_head = DB.Column(DB.String(65))
    gender = DB.Column(DB.String(2))
    birthdate = DB.Column(DB.Date)
    pregnant = DB.Column(DB.Boolean, default=0)
    disability = DB.Column(DB.String(55))
    comorbidity = DB.Column(DB.String(55))
    members = DB.Column(DB.JSON, default={})

class HouseholdDataSchema(MARSHMALLOW.SQLAlchemyAutoSchema):
    class Meta:
        model = HouseholdData