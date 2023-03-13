"""
Contacts Functions Utility File
"""

from datetime import datetime
from sqlalchemy.orm import joinedload, contains_eager
from connection import DB
from src.models.events import Activity, ActivitySchema
from werkzeug.utils import secure_filename
import os
from config import APP_CONFIG

UPLOAD_DIRECTORY = APP_CONFIG["storage"]
MAX_CONTENT_LENGTH = 16 * 1024 * 1024 #16MB
ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif"]

def save_activity(data, file):
    """
    Function that save activity
    """

    activity_id = data["activity_id"]
    start_date = data["start_date"]
    end_date = data["end_date"]
    activity_name = data["activity_name"]
    activity_place = data["activity_place"]
    activity_note = data["activity_note"]
    status = None
    feedback = None


    try:
        ret_val = None
        if activity_id == 0 or activity_id == "0":
            insert_activity = Activity(
                start_date=start_date,
                end_date=end_date,
                activity_name=activity_name,
                activity_place=activity_place,
                activity_note=activity_note
            )

            DB.session.add(insert_activity)
            status = True
            feedback = "Successfully saved activity!"
            DB.session.flush()
            DB.session.commit() 
            ret_val = insert_activity

        else:
            if file is not None:
                extension = os.path.splitext(file.filename)[1]
                if extension not in ALLOWED_EXTENSIONS:
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
            update = Activity.query.options(DB.raiseload("*")).get(activity_id)
            update.start_date = start_date
            update.end_date = end_date
            update.activity_name = activity_name
            update.activity_place = activity_place
            update.activity_note = activity_note
            if file is not None:
                update.file_name = file_name
            else:
                update.file_name = ""
            status = True
            feedback = "Successfully saved activity!"
            DB.session.flush()
            DB.session.commit()
            ret_val = update

    except Exception as err:
        print(err)
        status = False
        feedback = f"Saving failed, please report or contact the developers: (ERROR: {err})"
        DB.session.rollback()
    
    # Add notification

    if ret_val == None:
        data = {
            "status": status,
            "feedback": feedback,
            "activity_id": activity_id
        }
    else:
        data = {
            "status": status,
            "feedback": feedback,
            "activity_id": ret_val.activity_id
        }
    return data


def get_all_activity():
    query = Activity.query.all()
    result = ActivitySchema(many=True).dump(query)
    all_activity = []
    for row in result:
        data = {
            "id": row["activity_id"],
            "start": row["start_date"],
            "end": row["end_date"],
            "title": row["activity_name"],
            "place": row["activity_place"],
            "note": row["activity_note"],
            "file": row["file_name"],
            "issuer_id": row["issuer_id"]
        }
        all_activity.append(data)

    return {
            "status": True,
            "data": all_activity
        }


def delete_activity(data):
    status = None
    feedback = None
    activity_id = data["activity_id"]

    try:
        delete_activity = Activity.query.filter(
            Activity.activity_id == activity_id).first()
        DB.session.delete(delete_activity)
        DB.session.commit()
        status = True
        feedback = "Successfully deleted activity!"
    except Exception as err:
        DB.session.rollback()
        status = False
        print(err)
        feedback = f"Deleting failed, please report or contact the developers: (ERROR: {err})"

    data = {
        "status": status,
        "message": feedback
    }
    return data


