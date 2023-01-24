"""
Contacts Functions Controller File
"""

import traceback
from flask import Blueprint, jsonify, request
from connection import DB
from src.utils.feedback import save_feedback


FEEDBACK_BLUEPRINT = Blueprint("feedback_blueprint", __name__)


@FEEDBACK_BLUEPRINT.route("/feedback/save_feedback", methods=["GET","POST"])
def save_feedback_file():
    """
    Function that save feedback
    """

    data = request.get_json()
    if data is None:
        data = request.form
    uploaded_file = None
    try:
        uploaded_file = request.files['file'] 
        print(uploaded_file)
    except Exception:
        pass

    feedback = save_feedback(data, uploaded_file)
    print(uploaded_file)
   

    return jsonify(feedback)


