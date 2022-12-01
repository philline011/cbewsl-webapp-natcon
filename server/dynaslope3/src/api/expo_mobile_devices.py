"""
Contacts Functions Controller File
"""

import traceback
from flask import Blueprint, jsonify, request
from connection import DB
from src.models.mobile_devices import MobileDevices, MobileDevicesSchema

EXPO_MOBILE_DEVICES_BLUEPRINT = Blueprint("expo_mobile_devices_blueprint", __name__)


@EXPO_MOBILE_DEVICES_BLUEPRINT.route("/devices/create_or_update", methods=["POST"])
def save_event_activity():
    data = request.get_json()
    device = MobileDevices.query.filter(MobileDevices.user_id == data['user_id']).first()

    if device is None:
        new_device = MobileDevices(
            user_id=data['user_id'],
            device_id=data['token']
        )
        DB.session.add(new_device)
        DB.session.commit()
    else:
        device.user_id = data['user_id'],
        device.device_id = data['token']
        DB.session.commit()

    return jsonify({"status": True})


@EXPO_MOBILE_DEVICES_BLUEPRINT.route("/devices/get_token/<user_id>", methods=["GET"])
def get_user_token(user_id):
    device = MobileDevices.query.filter(MobileDevices.user_id == user_id).first()
    try:
        if device is not None:
            details = MobileDevicesSchema().dump(device)
            return jsonify({"status": True, "device": details})
        else:
            return jsonify({"status": False, "msg": 'Empty'})
    except Exception as err:
        print(err)
        return jsonify({"status": False})
