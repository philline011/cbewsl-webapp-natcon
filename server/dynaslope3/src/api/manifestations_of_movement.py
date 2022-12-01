"""
API/Controller file for moms
"""

from flask import Blueprint, jsonify, request
from connection import DB
from sqlalchemy import func
from sqlalchemy.orm import raiseload
from src.models.sites import Sites, SitesSchema
from src.models.monitoring import (
    MonitoringMoms, MomsInstances, MomsFeatures,
    MonitoringMomsSchema, MomsInstancesSchema,
    MomsFeaturesSchema, MonitoringMomsTemp,
    MonitoringMomsTempSchema
)
from src.models.users import Users
from src.utils.sites import get_sites_data
from src.utils.monitoring import write_monitoring_moms_to_db
from src.utils.extra import var_checker
from src.utils.manifestations_of_movements import get_moms_report
from werkzeug.utils import secure_filename
import os
import json
from config import APP_CONFIG

UPLOAD_DIRECTORY = APP_CONFIG["storage"]
MAX_CONTENT_LENGTH = 16 * 1024 * 1024 #16MB
ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif"]

MOMS_BLUEPRINT = Blueprint("moms_blueprint", __name__)


@MOMS_BLUEPRINT.route("/manifestations_of_movement/write_monitoring_moms_to_db", methods=["POST"])
def wrap_write_monitoring_moms_to_db(internal_json=None):
    """
    Handles moms. Make sure you pass lists to this function
    """
    try:
        if internal_json:
            json_data = internal_json
        else:
            json_data = request.get_json()
        var_checker("json_data", json_data, True)
        site_code = json_data["site_code"]
        site_id = DB.session.query(Sites).options(
            raiseload("*")).filter_by(site_code=site_code).first().site_id
        var_checker("site_id", site_id, True)
        moms_list = json_data["moms_list"]

        for moms_obs in moms_list:
            write_monitoring_moms_to_db(moms_details=moms_obs, site_id=site_id)

        update_temp_moms = MonitoringMomsTemp.query.get(json_data["temp_moms_id"])
        update_temp_moms.is_updated = 1
        
        DB.session.commit()
    except Exception as err:
        print(err)
        DB.session.rollback()
        return jsonify({"status": False, "message": "failed"})

    return jsonify({"status": True, "message": "success"})


@MOMS_BLUEPRINT.route("/manifestations_of_movement/write_moms_for_validation", methods=["POST"])
def wrap_write_moms_for_validation(internal_json=None):
    """
    Handles moms. Make sure you pass lists to this function
    """
    try:
        if internal_json:
            json_data = internal_json
        else:
            json_data = request.get_json()

        var_checker("json_data", json_data, True)
        
        uploaded_files = json_data["uploads"]
        file_name = f""
        for file in uploaded_files:
            name = file["filename"]
            path = file["filepath"]
            if "data/" in path:
                file_name += f"{name},"
            else: 
                file_name += f"{name},"
                name = secure_filename(file.filename)
                file.save(os.path.join(
                    UPLOAD_DIRECTORY,
                    name
                ))
        site_code = json_data["site_code"]
        site_id = DB.session.query(Sites).options(
            raiseload("*")).filter_by(site_code=site_code).first().site_id
        var_checker("site_id", site_id, True)
        moms_list = json_data["moms_list"]

        updated_moms_list = []
        for moms_obs in moms_list:
            moms_obs["file_name"] = file_name
            updated_moms_list.append(moms_obs)

        json_data["moms_list"] = updated_moms_list

        moms_data = json.dumps(json_data)

        insert_temp_moms = MonitoringMomsTemp(moms_data=moms_data, is_updated=0)
        DB.session.add(insert_temp_moms)

        DB.session.commit()
    except Exception as err:
        print(err)
        DB.session.rollback()
        return jsonify({"status": False, "message": "failed"})

    return jsonify({"status": True, "message": "success"})


@MOMS_BLUEPRINT.route("/manifestations_of_movement/get_temp_moms", methods=["GET"])
def wrap_get_temp_moms():
    query = MonitoringMomsTemp().query.filter(MonitoringMomsTemp.is_updated == 0).order_by(MonitoringMomsTemp.id.desc()).all()
    result = MonitoringMomsTempSchema(many=True).dump(query)
    all_data = []
    for row in result:
        to_object = json.loads(row["moms_data"])
        moms_list = to_object["moms_list"]
        updated_moms_list = []
        for moms in moms_list:
            reporter_id = moms["reporter_id"]
            reporter = Users.query.filter(Users.user_id == reporter_id).first()
            validator_id = moms["validator_id"]
            validator = Users.query.filter(Users.user_id == validator_id).first()
            moms_data = {
                **moms,
                "reporter": f"{reporter.first_name} {reporter.last_name}",
                "validator": f"{validator.first_name} {validator.last_name}"
            }
            updated_moms_list.append(moms_data)
        data = {
            "temp_moms_id": row["id"],
            "uploads": to_object["uploads"],
            "site_code": to_object["site_code"],
            "moms_list": updated_moms_list
        }
        all_data.append(data)

        
    return jsonify(all_data)

@MOMS_BLUEPRINT.route("/manifestations_of_movement/get_latest_alerts", methods=["GET"])
def get_latest_alerts():
    mm = MonitoringMoms
    mi = MomsInstances

    subquery = DB.session.query(DB.func.max(mi.site_id).label("site_id"), mi.instance_id, DB.func.max(
        mm.observance_ts).label("max_ts")).join(mm).group_by(mi.instance_id).subquery("t2")

    max_alerts = DB.session.query(DB.func.max(mm.op_trigger), subquery.c.site_id).join(mi).join(subquery, DB.and_(
        mm.observance_ts == subquery.c.max_ts, mi.instance_id == subquery.c.instance_id)).group_by(subquery.c.site_id).all()

    sites = get_sites_data(raise_load=True)
    sites_data = SitesSchema(many=True).dump(sites)

    for site in sites_data:
        site_id = site["site_id"]
        alert = next((x[0] for x in max_alerts if x[1] == site_id), 0)
        site["moms_alert"] = alert

    sites_data.sort(key=lambda x: x["moms_alert"], reverse=True)

    return jsonify(sites_data)


@MOMS_BLUEPRINT.route("/manifestations_of_movement/get_moms_instances/<site_code>", methods=["GET"])
def get_moms_instances(site_code):
    mi = MomsInstances
    query = mi.query.join(Sites).filter(Sites.site_code == site_code).all()
    # NOTE EXCLUDE:  exclude=("moms.moms_releases", )
    result = MomsInstancesSchema(many=True).dump(query)

    return jsonify(result)


@MOMS_BLUEPRINT.route("/manifestations_of_movement/get_moms_features", methods=["GET"])
@MOMS_BLUEPRINT.route("/manifestations_of_movement/get_moms_features/<site_code>", methods=["GET"])
def get_moms_features(site_code=None):
    features = MomsFeatures.query.all()

    result = MomsFeaturesSchema(
        many=True, exclude=("instances.site", )).dump(features)

    if site_code:
        sites_data = get_sites_data(site_code=site_code)
        site_id = sites_data.site_id

        for feature in result:
            instances = feature["instances"]
            filtered = [d for d in instances if d["site_id"] == site_id]

            feature["instances"] = filtered

    return jsonify(result)


@MOMS_BLUEPRINT.route("/moms/get_test_data", methods=["GET"])
def get_test_lang():
    from datetime import datetime
    ts = datetime(2021, 9, 23, 11, 59, 0)
    result = get_moms_report(
        timestamp=ts, timedelta_hour=3, minute=59, site_id=32)

    return jsonify(result)
