"""
Contacts Functions Utility File
"""

from datetime import datetime
from sqlalchemy.orm import joinedload, contains_eager
from connection import DB
from src.models.feedback import Feedback
from werkzeug.utils import secure_filename
import os
from config import APP_CONFIG

UPLOAD_DIRECTORY = APP_CONFIG["storage"]
MAX_CONTENT_LENGTH = 16 * 1024 * 1024 #16MB
ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif"]

def save_feedback(data, file):
    """
    Function that save feedback
    """
    feedback_id = data["feedback_id"]
    issue = data["issue"]
    concern = data["concern"]
    other_concern = data["other_concern"]
    status = None
    feedback = None

    try:
        file_name = None
        if file:
            extension = os.path.splitext(file.filename)[1]
        if file and extension not in ALLOWED_EXTENSIONS:
            feedback = 'File is not an Image'
            status = False
        else:
            file_name = None
            if file:
                file_name = secure_filename(file.filename)
                print(file_name)
                file.save(os.path.join(
                    UPLOAD_DIRECTORY,
                    file_name
                ))
        insert_feedback = Feedback(
            issue=issue,
            concern=concern,
            other_concern=other_concern,
            file_name=file_name
        )
        
        DB.session.add(insert_feedback)
        status = True
        feedback = "Successfully saved activity!"

        DB.session.commit()
    except Exception as err:
        print(err)
        status = False
        feedback = f"Saving failed, please report or contact the developers: (ERROR: {err})"
        DB.session.rollback()
        
    data = {
        "status": status,
        "feedback": feedback
    }
    return data