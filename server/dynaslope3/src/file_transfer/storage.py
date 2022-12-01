from flask import Blueprint, jsonify, request, send_file
from connection import DB
import os
from src.utils.helpers import Helpers as H
from config import APP_CONFIG

STORAGE_BLUEPRINT = Blueprint("storage_blueprint", __name__)
# STORAGE = os.path.normpath(os.path.join(os.path.dirname( __file__ ), '..', 'storage'))

@STORAGE_BLUEPRINT.route("/<site_name>/<file_name>", methods=["GET"])
def get_map(site_name, file_name):
    try:
        img_path = f"{APP_CONFIG['storage']}/{site_name.upper()}/{file_name}"
        ret_val = send_file(img_path, mimetype='image/jpg')
    except Exception as e:
        print(e)
        ret_val = "#"
    return ret_val

@STORAGE_BLUEPRINT.route("/profile_picture", methods=["POST"])
def upload_profilepicture():
    try:
        files = request.files
        file_path = f"{APP_CONFIG['storage']}/profile_pictures/"
        print(file_path)
        for fetch_filename in files:
            file = request.files[fetch_filename]
            final_path = H.upload(file=file, file_path=file_path)
        response = {'status': 200}
    except Exception as err:
        print(err)
        response = {'status': 400}
    finally:
        return jsonify(response)    

@STORAGE_BLUEPRINT.route("/moms", methods=["POST"])
def upload_moms():
    try:
        files = request.files
        file_path = f"{APP_CONFIG['storage']}/moms/"
        for fetch_filename in files:
            file = request.files[fetch_filename]
            final_path = H.upload(file=file, file_path=file_path)
        response = {'status': 200}
    except Exception as err:
        print(err)
        response = {'status': 400}
    finally:
        return jsonify(response)

@STORAGE_BLUEPRINT.route("/activity_schedule", methods=["POST"])
def upload_activity_schedule():
    try:
        form_json = request.form.to_dict(flat=False)
        files = request.files
        file_path = f"{APP_CONFIG['storage']}/activity_schedule/{form_json['activity_id'][0]}"
        for fetch_filename in files:
            file = request.files[fetch_filename]
            final_path = H.upload(file=file, file_path=file_path)
        response = {'status': 200}
    except Exception as err:
        print(err)
        response = {'status': 400}
    finally:
        return jsonify(response)

@STORAGE_BLUEPRINT.route("/<site_name>/<file_name>", methods=["GET"])
def download_map(site_name, file_name):
    try:
        img_path = f"{STORAGE}\{site_name}\{file_name}"
        ret_val = send_file(img_path, mimetype='image/jpg')
    except Exception as e:
        ret_val = "#"
    return ret_val