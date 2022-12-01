"""
"""

import hashlib
from datetime import datetime
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    jwt_refresh_token_required, get_jwt_identity
)
from flask import (
    Blueprint, jsonify, request
)
from src.models.users import UserAccounts, Users, UserProfile, UsersSchema, UserProfileSchema, UserEmails
from src.models.mobile_numbers import UserMobiles, MobileNumbers
from src.utils.contacts import get_gsm_id_by_prefix
from connection import DB, JWT
from src.utils.emails import send_mail
from src.models.otp import ForgotPasswordPending, ForgotPasswordPendingSchema
import uuid

from sqlalchemy import func
from src.utils.extra import var_checker

LOGIN_BLUEPRINT = Blueprint("login_blueprint", __name__)

failed_obj = {
    "ok": False,
    "is_logged_in": False
}


@JWT.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({
        **failed_obj,
        "message": "Missing authorization header",
        "type": "unauthorized"
    })


@JWT.expired_token_loader
def expired_token(callback):
    return jsonify({
        **failed_obj,
        "message": "Token expired. Login again",
        "type": "expired"
    })


@JWT.invalid_token_loader
def invalid_token(callback):
    return jsonify({
        **failed_obj,
        "message": "Signature verification failed",
        "type": "invalid"
    })


@LOGIN_BLUEPRINT.route("/check_session", methods=["GET"])
@jwt_required
def check_session():
    return jsonify({
        "ok": True,
        "is_logged_in": True,
        "message": "Authenticated"
    })


@LOGIN_BLUEPRINT.route("/refresh_session", methods=["GET"])
@jwt_refresh_token_required
def refresh_access_token():
    current_user = get_jwt_identity()
    return jsonify({
        "access_token": create_access_token(identity=current_user)
    })

@LOGIN_BLUEPRINT.route("/signup", methods=["POST"])
def __signup_user():
    data = request.get_json()
    ts = datetime.now()

    try:

        print(data)
        print("XXXXXXXXXXXXXXXX")
        user = Users(
            first_name=data['firstname'],
            middle_name=data['middlename'],
            last_name=data['lastname'],
            nickname=data['firstname'],
            sex=data['gender'],
            suffix=data['suffix'],
            birthday=data['kaarawan'],
        )
        DB.session.add(user)
        DB.session.commit()

        profile = UserProfile(
            user_id=user.user_id,
            address=data['address'],
            join_date=ts,
            designation_id=data['designation_id']
        )
        DB.session.add(profile)
        DB.session.commit()

        new_num = MobileNumbers(
            sim_num=data['mobile_no'],
            gsm_id=get_gsm_id_by_prefix(data['mobile_no'])
        )

        DB.session.add(new_num)
        DB.session.commit()

        insert_user_mobile = UserMobiles(
            user_id=user.user_id,
            mobile_id=new_num.mobile_id,
            status=True
        )

        DB.session.add(insert_user_mobile)
        DB.session.commit()

        # Don't remove
        # email = UserEmails(
        #     user_id=user.user_id,
        #     email=data['email'],
        # )
        # DB.session.add(email)
        # DB.session.commit()

        encode_password = str.encode(data['password'])
        hash_object = hashlib.sha512(encode_password)
        hex_digest_password = hash_object.hexdigest()
        _password = str(hex_digest_password)

        encode_salt = str.encode(str(ts))
        hash_object = hashlib.sha512(encode_salt)
        hex_digest_password = hash_object.hexdigest()
        salt = str(hex_digest_password)

        combined_password = str.encode(f"{_password}{salt}")
        hash_object = hashlib.sha512(combined_password)
        hex_digest_password = hash_object.hexdigest()
        password = str(hex_digest_password)

        account = UserAccounts(
            user_fk_id=user.user_id,
            username=data['username'],
            password=password,
            is_active=True,
            salt=salt,
            role=True
        )
        DB.session.add(account)
        DB.session.commit()

        return_obj = {
            "status": True,
            "username": data['username'],
            "password": data['password']
        }
    except Exception as err:
        print("---------------------")
        print(err)
        return_obj = {
            "status": False,
            "message": "Check form data sent to the server",
            "title": "Error"
        }
        DB.session.rollback()
    finally:
        return jsonify(return_obj)
        
@LOGIN_BLUEPRINT.route("/forgot_password", methods=["POST"])
def __forgot_password():
    data = request.get_json()
    try:
        indicator = str(data["indicator"])
    except:
        return_obj = {
            "ok": False,
            "message": "Check form data sent to the server",
            "title": "Error"
        }
        return jsonify(return_obj)
    
    is_username = False
    try:
        int(indicator)
        is_username = False
    except ValueError:
        is_username = True

    try:
        if is_username == True:
            user_account = UserAccounts.query.filter(DB.and_(UserAccounts.username == func.binary(indicator))).first()
            user = Users.query.filter(Users.user_id == user_account.user_fk_id).first()
        else:
            mobile_number = MobileNumbers.query.filter(DB.and_(MobileNumbers.sim_num == indicator)).first()
            user_mobile = UserMobiles.query.filter(UserMobiles.mobile_id == mobile_number.mobile_id).first()
            user_account = UserAccounts.query.filter(UserAccounts.username == user_mobile.user_id).first()
            user = Users.query.filter(Users.user_id == user_mobile.user_id).first()
        if user == None:
            return jsonify({"status": False, "message": "Invalid username / mobile number found.", "title": "Error"})
    except:
        return jsonify({"status": False, "message": "Invalid username / mobile number found.", "title": "Error"})

    try:
        

        exist = ForgotPasswordPending.query.filter(ForgotPasswordPending.user_id == user.user_id).first()
        if exist is not None:
            exist.OTP = str(uuid.uuid4())[:4]
            exist.validity = True
            DB.session.commit()
        else:
            forgot = ForgotPasswordPending(
                user_id = user.user_id,
                OTP = str(uuid.uuid4())[:4],
                validity = True,
            )
            DB.session.add(forgot)
            DB.session.commit()
        return_obj = {
            "status": True,
            "message": "Change password request has been submitted to your system administrator",
            "title": "OTP Sent"
        }
        # send_mail('')
        # print("SEND EMAILS")
        # send_mail(
        #     recipients='gelibertejohn@gmail.com',
        #     subject='This is a test',
        #     message='This is a test',
        # )
    except Exception as err:
        print(err)
        return_obj = {
            "status": False,
            "title": "Error",
            "message": "Network Error"
        }

    return jsonify(return_obj)

@LOGIN_BLUEPRINT.route("/verify_otp", methods=["POST"])
def __verify_otp():
    """/
    """
    data = request.get_json()

    try:
        password = str(data["password"])
        otp = str(data["otp"])
    except:
        return_obj = {
            "ok": False,
            "title": "Error",
            "message": "Check form data sent to the server",
        }
        return jsonify(return_obj)

    try:
        user = ForgotPasswordPending.query.filter(DB.and_(ForgotPasswordPending.OTP==otp, ForgotPasswordPending.validity==True)).first()
        if user is not None:
            account = UserAccounts.query.filter(UserAccounts.user_fk_id==user.user_id).first()
            encode_password = str.encode(data['password'])
            hash_object = hashlib.sha512(encode_password)
            hex_digest_password = hash_object.hexdigest()
            _password = str(hex_digest_password)

            ts = datetime.now()
            encode_salt = str.encode(str(ts))
            hash_object = hashlib.sha512(encode_salt)
            hex_digest_password = hash_object.hexdigest()
            salt = str(hex_digest_password)

            combined_password = str.encode(f"{_password}{salt}")
            hash_object = hashlib.sha512(combined_password)
            hex_digest_password = hash_object.hexdigest()
            password = str(hex_digest_password)

            account.password = password
            account.salt = salt
            DB.session.commit()

            user.validity = False
            DB.session.commit()
            return_obj = {"status": True, "message": "Password has been changed!", "title": "OTP Code Verified"}
        else:
            return_obj = {"status": False, "message": "Invalid OTP Code. Please contact your system administrator.", "title": "Invalid OTP Code"}
    except Exception as err:
        print(err)
        return_obj = {
            "ok": False,
            "title": "Error",
            "message": "Check form data sent to the server",
        }

    return jsonify(return_obj)

@LOGIN_BLUEPRINT.route("/login", methods=["POST", "GET"])
def __login_user():
    """/
    """
    data = request.get_json()
    ts = datetime.now()
    var_checker(f"{str(ts)} User logging in...", data["username"], True)

    try:
        username = str(data["username"])  # "jdguevarra"
        password = str(data["password"])  # "jdguevarra101"
    except:
        return_obj = {
            "ok": False,
            "message": "Check form data sent to the server"
        }
        return jsonify(return_obj)

    account, profile = get_account(username, password)
    if not account and not profile:
        message = "No username-password combination found"
        return_obj = {
            "ok": False,
            "message": message
        }
        print(message)
        return jsonify(return_obj)

    user = account.user
    mobile = UserMobiles.query.filter(UserMobiles.user_id == user.user_id).first()
    mobile_no = MobileNumbers.query.filter(MobileNumbers.mobile_id == mobile.mobile_id).first()
    access_token = create_access_token(identity=data['username'])
    refresh_token = create_refresh_token(identity=data['username'])
    message = "Successfully logged in"

    return_obj = {
        "ok": True,
        "data": {
            "user": UsersSchema().dump(user),
            "profile": UserProfileSchema().dump(profile),
            "mobile_no": mobile_no.sim_num,
            "tokens": {
                "access_token": access_token,
                "refresh_token": refresh_token
            }
        },
        "message": message
    }

    return jsonify(return_obj)


@LOGIN_BLUEPRINT.route("/logout", methods=["GET"])
def __logout_user():
    return "Successfully logged out"


# @LOGIN_BLUEPRINT.route("/login/accounts", methods=["POST", "GET"])
def get_account(username, password):
    """
    """

    raw = str.encode(password)
    hash_object = hashlib.sha512(raw)
    hex_digest_password = hash_object.hexdigest()
    password = str(hex_digest_password)

    init_account = UserAccounts.query.filter(DB.and_(
        UserAccounts.username == username)).first()
    if init_account is not None:
        encode_password = str.encode(f"{password}{init_account.salt}")
        hash_object = hashlib.sha512(encode_password)
        hex_digest_password = hash_object.hexdigest()
        combined_password = str(hex_digest_password)

        account = UserAccounts.query.filter(DB.and_(
            UserAccounts.username == username, UserAccounts.password == combined_password)).first()
        if account is not None:
            profile = UserProfile.query.filter(DB.and_(
                UserProfile.user_id == account.user_fk_id)).first()
            if profile is None:
                account = None
                profile = None
        else:
            account = None
            profile = None
    else:
        account = None
        profile = None

    return account, profile

@LOGIN_BLUEPRINT.route("/validate_username", methods=["POST"])
def validate_username():
    try:
        data = request.get_json()
        username_exists = UserAccounts.query.filter(DB.and_(
            UserAccounts.username == data['username'])).first()
        if username_exists is not None:
            return_obj = {
                "status": False,
                "message": "Username already exists."
            }
        else:
            return_obj = {
                "status": True
            }
    except:
        return_obj = {
            "status": False,
            "message": "Invalid API Request. Please contact the developer."
        }
    finally:
      return jsonify(return_obj)