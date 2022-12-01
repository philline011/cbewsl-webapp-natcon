"""
Users Functions Controller File
"""

from flask import Blueprint, jsonify, request
from connection import DB
from src.models.risk_profile import RiskProfile, RiskProfileSchema, RiskProfileMember, RiskProfileMemberSchema
from datetime import datetime, timedelta

RISK_PROFILE_BLUEPRINT = Blueprint("risk_profile_blueprint", __name__)

@RISK_PROFILE_BLUEPRINT.route("/risk_profile/add", methods=["POST"])
def add_profile():
    data = request.get_json()
    print(data)
    try:
        uid = str(data["u_id"])
        household_id = str(data["hh_id"])
        first_name = str(data["hh_first"])
        last_name = str(data["hh_last"])
        other_disability = str(data["hh_others"])
        birthdate = str(data["hh_bday"])
        gender = data["hh_gender"]
        pregnant = data["hh_pregnant"]
        disability = data["hh_disability"]
        members = data["hh_members"]
    except Exception as err:
        return_obj = {
            "status": False,
            "err": err,
            "message": "Check form data sent to the server"
        }
        return jsonify(return_obj)
    
    try:
        profile = RiskProfile(
            household_id=household_id,
            first_name=first_name,
            last_name=last_name,
            disability=disability,
            birthdate=birthdate,
            pregnant=pregnant,
            other_disability=other_disability,
            gender=gender,
            updated_by=uid,
            updated_at=datetime.now()
        )
        DB.session.add(profile)
        DB.session.flush()
        DB.session.commit()

        for member in members:
            household_member = RiskProfileMember(
                riskprofile_id=profile.id,
                first_name=member['m_first'],
                last_name=member['m_last'],
                disability=member['m_disability'],
                birthdate=member['m_bday'],
                pregnant=member['m_pregnant'],
                other_disability=member['m_others'],
                gender=member['m_gender'],
            )
            DB.session.add(household_member)
            DB.session.commit()
        return_obj = {
            "status": True,
            "title": "Success!",
            "message": "Successfully added Risk Profile!"
        }
    except Exception as err:
        print(err)
        return_obj = {
            "status": False,
            "err": err,
            "message": "Check form data sent to the server"
        }

    return jsonify(return_obj)

@RISK_PROFILE_BLUEPRINT.route("/risk_profile/update", methods=["POST"])
def update_profile():
    json_data = request.get_json()
    head = RiskProfile.query.filter(RiskProfile.id == json_data['id']).first()
    head.household_id = json_data['hh_id']
    head.first_name = json_data['hh_first']
    head.last_name = json_data['hh_last']
    head.disability = json_data['hh_disability']
    head.birthdate = json_data['hh_bday']
    head.pregnant = json_data['hh_pregnant']
    head.other_disability = json_data['hh_others']
    head.gender = json_data['hh_gender']
    head.updated_by = json_data['u_id']
    head.updated_at = datetime.now()
    DB.session.commit()

    delete_members = RiskProfileMember.query.filter(RiskProfileMember.riskprofile_id==json_data['id']).delete()
    DB.session.commit()

    for member in json_data['hh_members']:
        household_member = RiskProfileMember(
            riskprofile_id=json_data['id'],
            first_name=member['m_first'],
            last_name=member['m_last'],
            disability=member['m_disability'],
            birthdate=member['m_bday'],
            pregnant=member['m_pregnant'],
            other_disability=member['m_others'],
            gender=member['m_gender'],
        )
        DB.session.add(household_member)
        DB.session.commit()

    return_obj = {
        "status": True,
        "title": "Success!",
        "message": "Successfully updated Risk Profile!"
    }

    return jsonify(return_obj)

@RISK_PROFILE_BLUEPRINT.route("/risk_profile/delete", methods=["POST"])
def delete_profile():
    try:
        json_data = request.get_json()
        delete_members = RiskProfileMember.query.filter(RiskProfileMember.riskprofile_id==json_data['id']).delete()
        delete_head = RiskProfile.query.filter(RiskProfile.id==json_data['id']).delete()
        DB.session.commit()
        return_obj = {
            "status": True,
            "title": "Success!",
            "message": "Successfully deleted Risk Profile!"
        }
    except Exception as err:
        print(err)
        return_obj = {
            "status": False,
            "title": "Error!"
        }
    return jsonify(return_obj)

@RISK_PROFILE_BLUEPRINT.route("/risk_profile/view/<id>", methods=["GET"])
def view_household(id):
    try:
        head = RiskProfile.query.filter(RiskProfile.id==id).first()
        ret_val = {
            'gender': head.gender,
            'pregnant': head.pregnant,
            'birthdate': head.birthdate,
            'last_name': head.last_name,
            'household_id': head.household_id,
            'other_disability': head.other_disability,
            'disability': head.disability,
            'first_name': head.first_name, 
            'id': head.id,
            'members': []
        }

        members = RiskProfileMember.query.filter(RiskProfileMember.riskprofile_id==head.id).all()
        for member in members:
            ret_val['members'].append({
                'gender': member.gender,
                'pregnant': member.pregnant,
                'birthdate': member.birthdate,
                'last_name': member.last_name,
                'other_disability': member.other_disability,
                'disability': member.disability,
                'first_name': member.first_name, 
                'm_id': member.id,
            })
        return_obj = {
            "status": True,
            "data": ret_val
        }
    except Exception as err:
        print(err)
        return_obj = {
            "status": False,
            "ret_val": []
        }

    return jsonify(return_obj)

@RISK_PROFILE_BLUEPRINT.route("/risk_profile/get_all", methods=["GET"])
def get_all():
    try:
        profiles = RiskProfile.query.all()
        profile_list = list()
        for profile in profiles:
            temp = RiskProfileSchema().dump(profile)
            members = RiskProfileMember.query.filter(RiskProfileMember.riskprofile_id == temp['id']).all()
            temp['member_count'] = len(members)
            profile_list.append(temp)
        return_obj = {
            "status": True,
            "title": "Success!",
            "data": profile_list
        }
    except Exception as err:
        print(err)
        return_obj = {
            "status": False,
            "title": "Error!",
            "message": err
        }

    return jsonify(return_obj)