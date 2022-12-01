"""
API files for Chatterbox
"""

import json
from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, Response
from connection import DB, CELERY

from src.models.inbox_outbox import SmsTagsSchema, SmsQueue
from src.utils.chatterbox import (
    get_quick_inbox, get_message_tag_options,
    insert_message_on_database, get_latest_messages,
    get_messages_schema_dict, resend_message
)
from src.utils.monitoring import (
    write_monitoring_ewi_logs_to_db, get_latest_monitoring_event_per_site,
    get_earthquake_intensity, check_if_queued
)
from src.utils.ewi import create_ewi_message, insert_ewi_sms_narrative, format_alert_fyi_message
from src.utils.general_data_tag import insert_data_tag
from src.utils.narratives import write_narratives_to_db, get_narrative_text
from src.utils.contacts import get_contacts_per_site, get_org_ids
from src.websocket.monitoring_tasks import execute_update_db_alert_ewi_sent_status
from src.websocket.misc_ws import send_notification
from src.utils.extra import var_checker, retrieve_data_from_memcache



CHATTERBOX_BLUEPRINT = Blueprint("chatterbox_blueprint", __name__)


@CHATTERBOX_BLUEPRINT.route("/chatterbox/get_routine_ewi_template", methods=["GET"])
def get_routine_ewi_template():
    """
    """

    template = create_ewi_message(release_id=None)
    # var_checker("template", template, True)

    return template


@CELERY.task(name="send_routine_ewi_task", ignore_results=True)
@CHATTERBOX_BLUEPRINT.route("/chatterbox/send_routine_ewi_sms", methods=["POST"])
def wrap_send_routine_ewi_sms(data=None):
    """
    Big function handling the preparation of EWI SMS for Routine
    Step 1. loop provided site list
    Step 2. generate message per site
    Step 3. get the recipients
    Step 4. Prep narrative
    Step 5. Tag
    """

    is_task_call = True  # if function called directly
    if not data:
        data = request.get_json()
        is_task_call = False

    site_list = data["site_list"]
    user_id = data["user_id"]
    nickname = data["nickname"]
    # var_checker("site_list", site_list, True)
    priority = retrieve_data_from_memcache(
        "sms_priority",
        {"keyword": "routine"},
        retrieve_attr="priority_id")

    response = {
        "message": "success",
        "status": True,
        "site_ids": []
    }

    for site in site_list:
        site_code = site["site_code"]
        site_id = site["site_id"]
        release_id = site["release_id"]
        event_id = site["event_id"]

        try:
            # NOTE: UMI special case
            if site_id == 50:
                continue

            #######################
            # PREPARE EWI MESSAGE #
            #######################
            ewi_message = create_ewi_message(release_id=release_id)
            ewi_message += f" - {nickname} from PHIVOLCS-DYNASLOPE"
            # var_checker("ewi_message", ewi_message, True)

            ################################
            # PREPARE RECIPIENT MOBILE IDS #
            ################################
            org_id_list = get_org_ids(
                scopes=[0, 1, 2], org_names=["lgu", "lewc"])
            routine_recipients = get_contacts_per_site(
                site_codes=[site_code], org_ids=org_id_list,
                include_ewi_restrictions=True)

            mobile_id_list = []
            for recip in routine_recipients:
                if recip["ewi_restriction"] and recip["ewi_restriction"] == -1:
                    continue

                mobile_numbers = recip["mobile_numbers"]
                for item in mobile_numbers:
                    mobile_number = item["mobile_number"]
                    mobile_id_list.append(mobile_number)
            # var_checker("mobile_id_list", mobile_id_list, True)

            #############################
            # STORE MESSAGE TO DATABASE #
            #############################
            outbox_id = insert_message_on_database({
                "sms_msg": ewi_message,
                "recipient_list": mobile_id_list,
                "priority": priority
            })

            #######################
            # TAG THE NEW MESSAGE #
            #######################
            tag_details = {
                "outbox_id": outbox_id,
                "user_id": user_id,
                "ts": datetime.now()
            }
            tag_id = 18  # TODO: FOR REFACTORING, for #EwiMessage
            insert_data_tag("smsoutbox_user_tags", tag_details, tag_id)

            #############################
            # PREPARE ROUTINE NARRATIVE #
            #############################
            # NOTE: Hardcoded narrative muna
            narrative = f"Sent 12NN routine EWI SMS to LEWC, BLGU, MLGU"
            narrative_id = write_narratives_to_db(
                site["site_id"], datetime.now(), narrative,
                1, user_id, event_id
            )
            DB.session.commit()

            action = "send"
            remarks = None
            ret_obj = {
                "status": True,
                "message": "success"
            }
      
        except Exception as err:
            var_checker("ERROR: Releasing Routine EWI SMS", err, True)
            DB.session.rollback()
            if hasattr(err, "message"):
                error_msg = err.message
            else:
                error_msg = err

            response["message"] = "failed"
            response["status"] = False
            response["site_ids"].append(site["site_code"])

            action = "error"
            remarks = error_msg
            ret_obj = {
                "status": False,
                "message": "error"
            }

        if not ret_obj["status"] and is_task_call:
            send_notification("ewi_sending_error", {
                "component": "sms",
                "error_message": error_msg,
                "site_code": site_code
            })

            write_narratives_to_db(
                site_id=site_id,
                timestamp=datetime.now(),
                narrative="Sending routine EWI message via queue failed",
                type_id=1,
                user_id=user_id,
                event_id=event_id
            )

        write_monitoring_ewi_logs_to_db(
            release_id=release_id,
            component="sms",
            action=action,
            remarks=remarks
        )

    # NOTE: Routine EWI sent status only
    # considers the EWI status of the first site
    execute_update_db_alert_ewi_sent_status(
        alert_db_group=data["alert_db_group"],
        site_id=None, ewi_group="sms",
        release_id=site_list[0]["release_id"]
    )

    if is_task_call:
        return response

    return jsonify(response)


@CHATTERBOX_BLUEPRINT.route("/chatterbox/queue_routine_ewi_sms", methods=["POST"])
def queue_routine_ewi_sms():
    """
    Queue Routine EWI SMS
    """

    data = request.get_json()
    site_list = data["site_list"]
    release_time = datetime.strptime(
        data["prescribed_release_time"] + " +0800", "%Y-%m-%d %H:%M:%S %z")
    release_time = release_time + timedelta(minutes=1)

    task_id = wrap_send_routine_ewi_sms.apply_async(
        [data], eta=release_time)

    for site in site_list:
        write_monitoring_ewi_logs_to_db(
            release_id=site["release_id"],
            component="sms",
            action="queue",
            remarks=task_id
        )

        write_narratives_to_db(
            site_id=site["site_id"],
            timestamp=datetime.now(),
            narrative="Added routine EWI message to the sending queue",
            type_id=1,
            user_id=data["user_id"],
            event_id=site["event_id"]
        )

    # NOTE: Routine EWI sent status only
    # considers the EWI status of the first site
    execute_update_db_alert_ewi_sent_status(
        alert_db_group=data["alert_db_group"],
        site_id=None, ewi_group="sms",
        release_id=site_list[0]["release_id"]
    )

    ret_obj = {
        "status": True,
        "message": "success"
    }

    return ret_obj


@CHATTERBOX_BLUEPRINT.route("/chatterbox/cancel_queued_routine_ewi_sms", methods=["POST"])
def cancel_queued_routine_ewi_sms():
    """
    Cancel Queued Routine EWI SMS
    """

    data = request.get_json()
    site_list = data["site_list"]
    task_id = data["task_id"]

    CELERY.control.revoke(task_id)

    for site in site_list:
        write_monitoring_ewi_logs_to_db(
            release_id=site["release_id"],
            component="sms",
            action="cancel",
            remarks=task_id
        )

        write_narratives_to_db(
            site_id=site["site_id"],
            timestamp=datetime.now(),
            narrative="Canceled scheduled sending of routine EWI message on queue",
            type_id=1,
            user_id=data["user_id"],
            event_id=site["event_id"]
        )

    # NOTE: Routine EWI sent status only
    # considers the EWI status of the first site
    execute_update_db_alert_ewi_sent_status(
        alert_db_group=data["alert_db_group"],
        site_id=None, ewi_group="sms",
        release_id=site_list[0]["release_id"]
    )

    ret_obj = {
        "status": True,
        "message": "success"
    }

    return ret_obj


@CHATTERBOX_BLUEPRINT.route("/chatterbox/quick_inbox", methods=["GET"])
def wrap_get_quick_inbox():
    """
    """

    messages = get_quick_inbox()
    return jsonify(messages)


@CHATTERBOX_BLUEPRINT.route("/chatterbox/get_message_tag_options/<source>", methods=["GET"])
def wrap_get_message_tag_options(source):
    """
    """

    sms_tags = retrieve_data_from_memcache(
        "sms_tags", filters_dict={"source": source}, retrieve_one=False)
    return jsonify(sms_tags)


@CHATTERBOX_BLUEPRINT.route("/chatterbox/get_ewi_message/<release_id>", methods=["GET"])
def wrap_get_ewi_message(release_id):
    """
    """

    ewi_msg = create_ewi_message(release_id)
    return ewi_msg


@CELERY.task(name="send_message_task", ignore_results=True)
@CHATTERBOX_BLUEPRINT.route("/chatterbox/send_message", methods=["POST"])
def wrap_insert_message_on_database(data=None):
    """
    """

    is_task_call = True  # if function called directly
    if not data:
        data = request.get_json()
        is_task_call = False
    else:
        task_id = CELERY.current_task.request.id

    ret_obj = {
        "status": True,
        "message": "success"
    }

    try:
        is_ewi = data["is_ewi"]
    except KeyError:
        is_ewi = False

    if is_ewi:
        keyword = data["alert_db_group"]
        if data["alert_db_group"] in ["latest", "overdue"]:
            keyword = "event"

        priority = retrieve_data_from_memcache(
            "sms_priority",
            {"keyword": keyword},
            retrieve_attr="priority_id"
        )
        data["priority"] = priority

    # Get data needed for auto-tagging rain info
    rain_priority_id = retrieve_data_from_memcache(
        "sms_priority",
        {"keyword": "rain_info"},
        retrieve_attr="priority_id"
    )
    is_rain_info = data["priority"] == rain_priority_id
    try:
        tag_data = data["tag_data"]
    except KeyError:
        tag_data = None

    try:
        outbox_id = insert_message_on_database(data)

        if is_ewi:
            user_id = data["user_id"]
            insert_ewi_sms_narrative(
                data["release_id"], user_id, data["recipient_list"])

            tag_details = {
                "user_id": user_id,
                "outbox_id": outbox_id,
                "ts": datetime.now()
            }

            # TODO: change hard-coded code
            insert_data_tag(
                tag_type="smsoutbox_user_tags",
                tag_details=tag_details,
                tag_id=18  # hardcoded for #EwiMessage
            )

            action = "send"
            remarks = None
    
        elif is_task_call:
            row = SmsQueue.query.filter_by(task_id=task_id).first()
            row.ts_sent = datetime.now()

            if is_rain_info and tag_data:
                tag_details = {
                    "user_id": data["user_id"],
                    "outbox_id": outbox_id,
                    "ts": datetime.now()
                }

                # TODO: change hard-coded code
                insert_data_tag(
                    tag_type="smsoutbox_user_tags",
                    tag_details=tag_details,
                    tag_id=21  # hardcoded for #RainInfo
                )

                rain_info_narrative = get_narrative_text(
                    narrative_type="sms_tagging",
                    details={
                        "tag": "#RainInfo",
                        "additional_data": tag_data["contact_person"]
                    }
                )

                for site_id in tag_data["site_list"]:
                    event = get_latest_monitoring_event_per_site(
                        site_id=site_id, raise_load=True)

                    write_narratives_to_db(
                        site_id=site_id,
                        timestamp=datetime.now(),
                        narrative=rain_info_narrative,
                        type_id=1,
                        user_id=data["user_id"],
                        event_id=event.event_id
                    )

            DB.session.commit()
    except Exception as err:
        print(err)

        if hasattr(err, "message"):
            error_msg = err.message
        else:
            error_msg = err

        remarks = error_msg
        action = "error"

        ret_obj = {
            "status": False,
            "message": f"Error: {error_msg}"
        }

    if is_ewi:
        if not ret_obj["status"] and is_task_call:
            send_notification("ewi_sending_error", {
                "component": "sms",
                "error_message": error_msg,
                "site_code": data["site_code"]
            })

            write_narratives_to_db(
                site_id=data["site_id"],
                timestamp=datetime.now(),
                narrative="Sending EWI message via queue failed",
                type_id=1,
                user_id=data["user_id"],
                event_id=data["event_id"]
            )

        write_monitoring_ewi_logs_to_db(
            release_id=data["release_id"],
            component="sms",
            action=action,
            remarks=remarks
        )

        execute_update_db_alert_ewi_sent_status(
            data["alert_db_group"],
            data["site_id"], "sms",
            data["release_id"]
        )

    if is_task_call:
        return ret_obj

    return jsonify(ret_obj)


@CHATTERBOX_BLUEPRINT.route("/chatterbox/queue_message", methods=["POST"])
def queue_message():
    """
    Queue message for sending
    """

    data = request.get_json()
    is_ewi = data["is_ewi"]

    if is_ewi:
        release_id = data["release_id"]
        is_queued = check_if_queued(release_id, 1)
        if is_queued:
            ret_obj = {
                "status": "queued",
                "message": "This EWI SMS is already queued!"
            }
        else:    
            release_time = datetime.strptime(
                data["prescribed_release_time"] + " +0800", "%Y-%m-%d %H:%M:%S %z")
            task_id = wrap_insert_message_on_database.apply_async(
                [data], eta=release_time)

            write_monitoring_ewi_logs_to_db(
                release_id=release_id,
                component="sms",
                action="queue",
                remarks=task_id
            )

            write_narratives_to_db(
                site_id=data["site_id"],
                timestamp=datetime.now(),
                narrative="Added EWI message to the sending queue",
                type_id=1,
                user_id=data["user_id"],
                event_id=data["event_id"]
            )

            execute_update_db_alert_ewi_sent_status(
                data["alert_db_group"],
                data["site_id"], "sms",
                release_id
            )

            ret_obj = {
                "status": True,
                "message": "success"
            }
    else:
        ts_sending = datetime.strptime(
            data["ts_sending"] + " +0800", "%Y-%m-%d %H:%M:%S %z")
        task_id = wrap_insert_message_on_database.apply_async(
            [data], eta=ts_sending)

        sms_data = {
            "sms_msg": data["sms_msg"],
            "recipient_list": data["recipient_list"]
        }

        row = SmsQueue(
            task_id=task_id,
            ts_sending=data["ts_sending"],
            sms_data=json.dumps(sms_data),
            user_id=data["user_id"]
        )

        DB.session.add(row)
        DB.session.commit()

        ret_obj = {
            "status": True,
            "message": "success"
        }

    return ret_obj


@CHATTERBOX_BLUEPRINT.route("/chatterbox/cancel_queued_message", methods=["POST"])
def cancel_queued_message():
    """
    Cancels an already queued message
    """

    data = request.get_json()

    task_id = data["task_id"]
    CELERY.control.revoke(task_id)

    if data["is_ewi"]:
        release_id = data["release_id"]
        site_id = data["site_id"]

        write_monitoring_ewi_logs_to_db(
            release_id=release_id,
            component="sms",
            action="cancel",
            remarks=task_id
        )

        write_narratives_to_db(
            site_id=site_id,
            timestamp=datetime.now(),
            narrative="Canceled scheduled sending of EWI message on queue",
            type_id=1,
            user_id=data["user_id"],
            event_id=data["event_id"]
        )

        execute_update_db_alert_ewi_sent_status(
            data["alert_db_group"],
            site_id, "sms",
            release_id
        )
    else:
        row = SmsQueue.query.filter_by(task_id=task_id).first()

        if row:
            row.ts_cancelled = datetime.now()
            row.cancelled_by = data["user_id"]
            DB.session.commit()

    ret_obj = {
        "status": True,
        "message": "success"
    }

    return ret_obj


@CHATTERBOX_BLUEPRINT.route("/chatterbox/load_more_messages/<mobile_id>/<batch>", methods=["GET"])
def load_more_messages(mobile_id, batch):
    """
    """
    mobile_id = int(mobile_id)
    batch = int(batch)

    messages = get_latest_messages(mobile_id, batch=batch)
    schema_msgs = get_messages_schema_dict(messages)

    return jsonify(schema_msgs)


@CHATTERBOX_BLUEPRINT.route("/chatterbox/resend_message/<outbox_status_id>", methods=["GET"])
def wrap_resend_message(outbox_status_id):
    """
    """

    status = True
    message = "Message resend success"

    try:
        resend_message(outbox_status_id)
    except Exception as err:
        print(err)

        if hasattr(err, "message"):
            error_msg = err.message
        else:
            error_msg = str(err)

        status = False
        message = error_msg

    return jsonify({"status": status, "message": message})


@CHATTERBOX_BLUEPRINT.route("/chatterbox/get_all_tags", methods=["GET"])
def get_all_tags():
    """
    """

    sms_tags = retrieve_data_from_memcache("sms_tags")
    return jsonify(sms_tags)


@CHATTERBOX_BLUEPRINT.route("/chatterbox/get_all_sms_priority", methods=["GET"])
def get_all_sms_priority():
    """
    """

    sms_priority = retrieve_data_from_memcache("sms_priority")
    return jsonify(sms_priority)


@CHATTERBOX_BLUEPRINT.route("/chatterbox/generate_alert_fyi_message", methods=["GET"])
def generate_alert_fyi_message():
    """
    Test Chatterbox function
    """

    ts = request.args.get("ts", default=None, type=str)
    sites = request.args.getlist("sites[]", type=int)
    internal_sym_id = request.args.get(
        "internal_sym_id", default=None, type=int)
    action = request.args.get("action", default=None, type=str)

    if not ts:
        ts = datetime.now()
    else:
        try:
            ts = datetime.strptime(ts, "%Y-%m-%d %H:%M:%S")
        except Exception:
            print(ts)
            return Response(
                "Timestamp format should be YYYY-MM-DD HH:mm:ss",
                status=400
            )
    if not sites:
        return Response("No sites sent (site IDs)", status=400)
    if not internal_sym_id:
        return Response("No internal_sym_id sent", status=400)
    if not action:
        return Response("No action string sent", status=400)

    data = format_alert_fyi_message(ts, sites, internal_sym_id, action)

    return jsonify(data)


@CHATTERBOX_BLUEPRINT.route("/chatterbox/get_alert_fyi_triggers", methods=["GET"])
def get_alert_fyi_triggers():
    """
    Retrieves all trigger sources for Alert FYI
    """

    trigger_list = retrieve_data_from_memcache("bulletin_triggers")
    trigger_list.sort(
        key=lambda x: x["internal_sym"]["trigger_symbol"]["trigger_hierarchy"]["hierarchy_id"])
    return jsonify(trigger_list)


@CHATTERBOX_BLUEPRINT.route("/chatterbox/test", methods=["GET"])
def test():
    """
    Test Chatterbox function
    """

    ts = request.args.get("ts", default=None, type=str)
    sites = request.args.getlist("sites", type=int)

    print(ts, sites)

    return "test"


@CHATTERBOX_BLUEPRINT.route("/chatterbox/get_eq_intensity_for_last_24hours", methods=["GET"])
def get_eq_intensity_for_last_24hours():
    """
    Get earthquake intensity information
    """
    data = request.get_json()
    print(data)
    start_ts = request.args.get("start_ts", default=None, type=str)
    end_ts = request.args.get("end_ts", default=None, type=str)

    data = get_earthquake_intensity(start_ts, end_ts)

    return jsonify(data)
