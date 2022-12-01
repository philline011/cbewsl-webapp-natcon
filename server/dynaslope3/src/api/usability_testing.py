import os
import subprocess
import json
from flask import Blueprint, jsonify, request
from connection import DB
from config import APP_CONFIG
from src.utils.usability_testing import (
    get_scenarion_groups_data,
    insert_scenario_group, get_all_sensors_data,
    start_scenario, execute_update_machine_time
)
import pandas as pd

USABILITY_TESTING_BLUEPRINT = Blueprint(
    "usability_testing_blueprint", __name__)


@USABILITY_TESTING_BLUEPRINT.route("/usability_testing/get_scenarios", methods=["GET"])
def get_scenarios():
    scenarios = get_scenarion_groups_data()
    return jsonify(scenarios)


@USABILITY_TESTING_BLUEPRINT.route("/usability_testing/get_all_sensors_data", methods=["GET"])
def get_sensors_data():
    data = get_all_sensors_data()
    return jsonify(data)


@USABILITY_TESTING_BLUEPRINT.route("/usability_testing/insert_scenario", methods=["POST", "GET"])
def insert_scenario():
    data = request.get_json()
    status = None
    message = ""

    try:
        insert_scenario_group(data)
        status = True
        message = "Successfully saved!"
    except Exception as err:
        status = True
        message = f"Error: {err}"

    feedback = {
        "status": status,
        "message": message
    }

    return jsonify(feedback)


@USABILITY_TESTING_BLUEPRINT.route("/usability_testing/start_scenario", methods=["GET", "POST"])
def start_scenario_and_update_time():
    data = request.get_json()
    status = None
    message = ""
    return_data = []
    try:
        scenario_data = data["scenario_data"]
        user_id = data["user_id"]
        scenario_name = data["scenario_name"]
        return_data = start_scenario(scenario_data=scenario_data, user_id=user_id, scenario_name=scenario_name)
        status = True
        message = "Successfully started scenario!"
    except Exception as err:
        status = False
        message = f"Error: {err}"

    feedback = {
        "status": status,
        "message": message,
        "data": return_data
    }

    return jsonify(feedback)


@USABILITY_TESTING_BLUEPRINT.route("/usability_testing/update_machine_time", methods=["GET", "POST"])
def update_machine_time():
    data = request.get_json()
    status = None
    message = ""
    print(data)
    try:
        updated_machine_time = data["machine_time"]
        execute_update_machine_time(updated_machine_time=updated_machine_time)
        status = True
        message = "Successfully updated machine time!"
    except Exception as err:
        status = False
        message = f"Error: {err}"

    feedback = {
        "status": status,
        "message": message
    }

    return jsonify(feedback)


@USABILITY_TESTING_BLUEPRINT.route("/usability_testing/generate_subsurface_alert", methods=["POST"])
def wrap_generate_subsurface_alert():
    try:
        alert_data = request.get_json()
        if alert_data is None:
            alert_data = request.form
        alert_level = alert_data["alert_level"]
        ts = pd.to_datetime(alert_data["ts"])
        alert_data = {
            "alert_level": alert_level,
            "site_id": 24,
            "ts": ts
        }
        data = [{
            "type": "subsurface",
            "type_data": alert_data
        }]
        start_scenario(scenario_data=data)
        return jsonify({
            "status": True,
            "message": "success"
        })
    except Exception as err:
        print(err)
        return jsonify({
            "status": True,
            "message": f"error: {err}"
        })


@USABILITY_TESTING_BLUEPRINT.route("/usability_testing/generate_surficial_alert", methods=["POST"])
def wrap_generate_surficial_alert():
    try:
        alert_data = request.get_json()
        if alert_data is None:
            alert_data = request.form
        alert_level = alert_data["alert_level"]
        ts = pd.to_datetime(alert_data["ts"])
        alert_data = {
            "alert_level": alert_level,
            "site_id": 24,
            "ts": ts
        }
        data = [{
            "type": "surficial",
            "type_data": alert_data
        }]

        start_scenario(scenario_data=data)

        return jsonify({
            "status": True,
            "message": "success"
        })
    except Exception as err:
        print(err)
        return jsonify({
            "status": True,
            "message": f"error: {err}"
        })


@USABILITY_TESTING_BLUEPRINT.route("/usability_testing/generate_rainfall_alert", methods=["POST"])
def wrap_generate_rainfall_alert():
    try:
        alert_data = request.get_json()
        if alert_data is None:
            alert_data = request.form

        ts = pd.to_datetime(alert_data["ts"])
        alert_data = {
            "rain_alert": 'a',#1-day cumulative
            "rain_id": 24,
            "site_id": 24,
            "ts": ts
        }
        data = [{
            "type": "rainfall",
            "type_data": alert_data
        }]

        start_scenario(scenario_data=data)

        return jsonify({
            "status": True,
            "message": "success"
        })
    except Exception as err:
        print(err)
        return jsonify({
            "status": True,
            "message": f"error: {err}"
        })


@USABILITY_TESTING_BLUEPRINT.route("/usability_testing/generate_eq_alert", methods=["POST"])
def wrap_generate_eq_alert():
    try:
        alert_data = request.get_json()
        if alert_data is None:
            alert_data = request.form

        ts = pd.to_datetime(alert_data["ts"])
        alert_data = {
            "site_id": 24,
            "ts": ts
        }
        data = [{
            "type": "earthquake",
            "type_data": alert_data
        }]

        start_scenario(scenario_data=data)

        return jsonify({
            "status": True,
            "message": "success"
        })
    except Exception as err:
        print(err)
        return jsonify({
            "status": True,
            "message": f"error: {err}"
        })