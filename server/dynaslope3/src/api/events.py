"""
Contacts Functions Controller File
"""

import traceback
from flask import Blueprint, jsonify, request
from connection import DB
from src.utils.events import save_activity, get_all_activity, delete_activity
from src.utils.helpers import Helpers as H
from config import APP_CONFIG


EVENTS_BLUEPRINT = Blueprint("events_blueprint", __name__)


@EVENTS_BLUEPRINT.route("/events/save_activity", methods=["GET", "POST"])
def save_event_activity():
    """
    Function that save and update activity
    """

    data = request.get_json()
    if data is None:
        data = request.form
    uploaded_file = None
    try:
        uploaded_file = request.files['file'] 
    except Exception:
        pass

    feedback = save_activity(data, uploaded_file)

    return jsonify(feedback)

@EVENTS_BLUEPRINT.route("/events/save_photo", methods=["POST"])
def save_event_photos():
    try:
        files = request.files
        file_path = f"{APP_CONFIG['storage']}/"
        for fetch_filename in files:
            file = request.files[fetch_filename]
            final_path = H.upload(file=file, file_path=file_path)
        response = {'status': 200}
    except Exception as err:
        print(err)
        response = {'status': 400}
    finally:
        return jsonify(response)    

@EVENTS_BLUEPRINT.route("/events/get_all_events", methods=["GET"])
def get_events():
    try:
    
        data = get_all_activity()

        return_value = {
            'status': True,
            'data': data
        }
    except Exception as err:
        return_value = {
            'status': False,
            'message': 'Failed to load event list.'
        }
    finally:
        return jsonify(return_value)


@EVENTS_BLUEPRINT.route("/events/delete_activity", methods=["GET", "POST"])
def wrap_delete_activity():
    """
    Function that delete activity
    """

    data = request.get_json()
    if data is None:
        data = request.form

    feedback = delete_activity(data)

    return jsonify(feedback)

