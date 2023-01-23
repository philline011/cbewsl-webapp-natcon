"""
Contacts Functions Controller File
"""

import traceback
from flask import Blueprint, jsonify, request
from connection import DB
from src.utils.feedback import save_feedback
from config import APP_CONFIG
import os

MISC_BLUEPRINT = Blueprint("misc_blueprint", __name__)


DIRECTORY = APP_CONFIG["storage"]
MAX_CONTENT_LENGTH = 16 * 1024 * 1024 #16MB
ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif"]

@MISC_BLUEPRINT.route("/misc/get_files/<folder>", methods=["GET","POST"])
def get_files(folder):
    return_val = {}
    try:
        file_list = []
        isExist = os.path.exists(f"{DIRECTORY}/{folder}")
        if isExist == False:
            os.mkdir(f"{DIRECTORY}/{folder}")
        files = os.listdir(f"{DIRECTORY}/{folder}")

        for file in files:
            filename = os.path.splitext(file)[0]
            file_extension = split_tup = os.path.splitext(file)[1]
            file_stat = os.stat(f"{DIRECTORY}/{folder}/{file}")
            file_size =  file_stat.st_size / (1024 * 1024)
            file_list.append({
                "filename": filename,
                "size": file_size,
                "extension": file_extension,
                "folder": folder
            })
        return_val = {
            "status": True,
            "data": file_list
        }
    except Exception as err:
        return_val = {
            "status": False,
            "data": []
        }
    finally:
        return jsonify(return_val)