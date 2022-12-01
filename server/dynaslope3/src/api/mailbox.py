"""
Contacts Functions Controller File
"""

import os
import traceback
from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from connection import CELERY
from src.utils.emails import send_mail, get_email_subject, allowed_file
from src.utils.bulletin import write_bulletin_sending_narrative
from src.utils.monitoring import write_eos_data_analysis_to_db, write_monitoring_ewi_logs_to_db, check_if_queued
from src.api.end_of_shift import get_eos_email_details
from src.utils.narratives import write_narratives_to_db
from src.websocket.monitoring_tasks import execute_update_db_alert_ewi_sent_status
from src.websocket.misc_ws import send_notification
from src.utils.extra import var_checker

from config import APP_CONFIG

MAILBOX_BLUEPRINT = Blueprint("mailbox_blueprint", __name__)


@MAILBOX_BLUEPRINT.route("/mailbox/get_email_subject/<mail_type>/<site_code>/<date>", methods=["GET"])
def wrap_get_email_subject(mail_type, site_code, date):
    """
    Send email function
    """

    subject = get_email_subject(
        mail_type, details={"site_code": site_code, "date": date})

    return subject


@CELERY.task(name="send_bulletin_task", ignore_results=True)
@MAILBOX_BLUEPRINT.route("/mailbox/send_bulletin_email", methods=["POST"])
def send_bulletin_email(json_data=None):
    """
    Function that sends emails
    """

    is_direct_call = True
    if not json_data:
        json_data = request.get_json()
        is_direct_call = False

    release_id = json_data["release_id"]
    site_id = json_data["site_id"]
    alert_db_group = json_data["alert_db_group"]
    site_code = json_data["site_code"]
    sender_id = json_data["sender_id"]

    try:
        subject = json_data["subject"]
        recipients = json_data["recipients"]
        mail_body = json_data["mail_body"]
        status = True

        file_name = json_data["file_name"]
        narrative_details = json_data["narrative_details"]

        send_mail(
            recipients=recipients,
            subject=subject,
            message=mail_body,
            file_name=file_name,
            bulletin_release_id=release_id
        )

        narrative_id = write_bulletin_sending_narrative(
            recipients, sender_id, site_id, narrative_details)

        action = "send"
        response_msg = "EWI bulletin email succesfully sent!"
        remarks = None
      
    except KeyError as err:
        var_checker("PROBLEM with Sending Bulletin", err, True)
        response_msg = "Key error: EWI bulletin email sending unsuccessful..."
        reason = "web release error"
        status = False
        remarks = response_msg
    except Exception as err:
        print(traceback.format_exc())
        var_checker("PROBLEM with Sending Bulletin", err, True)
        response_msg = "System/Network issue: EWI bulletin email sending unsuccessful..."
        reason = "system/network issue on server"
        status = False
        remarks = response_msg

    if not status:
        narrative_details = f"EWI bulletin sending failed due to {reason}."
        action = "error"

        write_narratives_to_db(
            site_id=site_id,
            timestamp=datetime.now(),
            narrative=narrative_details,
            type_id=1,
            user_id=sender_id,
            event_id=json_data["event_id"]
        )

    write_monitoring_ewi_logs_to_db(
        release_id=release_id,
        component="bulletin",
        action=action,
        remarks=remarks
    )

    execute_update_db_alert_ewi_sent_status(
        alert_db_group,
        site_id, "bulletin",
        release_id=release_id
    )

    if not status and is_direct_call:
        send_notification("ewi_sending_error", {
            "component": "bulletin",
            "error_message": response_msg,
            "site_code": site_code
        })

    ret_obj = {
        "message": response_msg,
        "status": status
    }

    if is_direct_call:
        return ret_obj

    return jsonify(ret_obj)


LAST_PRESCRIBED = None
COUNTER = 0


@MAILBOX_BLUEPRINT.route("/mailbox/queue_bulletin_email", methods=["POST"])
def queue_bulletin():
    """
    Queue message for sending
    """

    global LAST_PRESCRIBED
    global COUNTER

    data = request.get_json()
    release_id = data["release_id"]
    is_queued = check_if_queued(release_id, 2)
    if is_queued:
        ret_obj = {
            "status": "queued",
            "message": "This EWI Bulletin is already queued!"
        }
    else:
        prescribed_rt = datetime.strptime(
            data["prescribed_release_time"] + " +0800", "%Y-%m-%d %H:%M:%S %z")

        if not LAST_PRESCRIBED or LAST_PRESCRIBED < prescribed_rt:
            LAST_PRESCRIBED = prescribed_rt
            COUNTER = 0

        release_time = prescribed_rt + timedelta(seconds=10 * COUNTER)
        task_id = send_bulletin_email.apply_async(
            [data], eta=release_time)

        COUNTER += 1

        write_monitoring_ewi_logs_to_db(
            release_id=data["release_id"],
            component="bulletin",
            action="queue",
            remarks=task_id
        )

        write_narratives_to_db(
            site_id=data["site_id"],
            timestamp=datetime.now(),
            narrative="Added EWI bulletin to the sending queue",
            type_id=1,
            user_id=data["sender_id"],
            event_id=data["event_id"]
        )

        execute_update_db_alert_ewi_sent_status(
            data["alert_db_group"],
            data["site_id"], "bulletin",
            data["release_id"]
        )

        ret_obj = {
            "status": True,
            "message": "EWI bulletin email sending successfully queued!"
        }

    return ret_obj


@MAILBOX_BLUEPRINT.route("/mailbox/cancel_queued_bulletin", methods=["POST"])
def cancel_queued_bulletin():
    """
    Cancels an already queued bulletin
    """

    data = request.get_json()

    task_id = data["task_id"]
    release_id = data["release_id"]
    site_id = data["site_id"]

    CELERY.control.revoke(task_id)

    write_monitoring_ewi_logs_to_db(
        release_id=release_id,
        component="bulletin",
        action="cancel",
        remarks=task_id
    )

    write_narratives_to_db(
        site_id=site_id,
        timestamp=datetime.now(),
        narrative="Canceled scheduled sending of EWI bulletin on queue",
        type_id=1,
        user_id=data["sender_id"],
        event_id=data["event_id"]
    )

    execute_update_db_alert_ewi_sent_status(
        data["alert_db_group"],
        site_id, "bulletin",
        release_id
    )

    ret_obj = {
        "status": True,
        "message": "Queued EWI bulletin sending succesfully canceled!"
    }

    return ret_obj


@MAILBOX_BLUEPRINT.route("/mailbox/upload_temp", methods=["POST"])
def upload_temp_file():
    """
    uploads file to server @ temp<folder>/
    """
    if request.files:
        files = request.files.getlist("files")
        for file in files:
            if file.filename == '':
                print('No selected file')
            if file and allowed_file(file.filename):
                file.save(os.path.join(
                    APP_CONFIG['attachment_path'], file.filename))
    return "Success"


@MAILBOX_BLUEPRINT.route("/mailbox/send_eos_email", methods=["POST"])
def send_eos_email():
    """
    Function that sends emails
    """

    json_data = request.form
    files = request.files.getlist("attached_files")

    try:
        shift_ts = json_data["shift_ts"]
        event_id = json_data["event_id"]
        data_analysis = json_data["data_analysis"]
        file_name_ts = json_data["file_name_ts"]
        mail_body = json_data["mail_body"]

        write_eos_data_analysis_to_db(event_id, shift_ts, data_analysis)

        temp = get_eos_email_details(event_id, file_name_ts, to_json=False)
        recipients = temp["recipients"]
        subject = temp["subject"]
        file_name = temp["file_name"]

        eos_data = {
            "site_code": json_data["site_code"],
            "user_id": json_data["user_id"],
            "charts": json_data.getlist("charts"),
            "attached_files": files
        }

        send_mail(
            recipients=recipients,
            subject=subject,
            message=mail_body,
            eos_data=eos_data,
            file_name=file_name
        )
        DB.session.commit()
        return "Success"
    except KeyError as err:
        print(err)
        return "Email NOT sent. Problem in input."
    except Exception as err:
        raise err
