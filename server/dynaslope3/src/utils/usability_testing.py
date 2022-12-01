"""
"""
from connection import DB
import json
import random
import os
import pandas as pd
from datetime import datetime, timedelta
from urllib.request import urlopen
from config import APP_CONFIG
from src.models.analysis import (
    OperationalTriggers,
    TSMAlerts, NodeAlerts, Markers,
    MarkerAlerts, MarkerObservations, MarkerData,
    RainfallAlerts, EarthquakeAlerts, EarthquakeEvents,
    TSMSensors, TSMSensorsSchema, RainfallGauges,
    RainfallGaugesSchema, RainfallPriorities,
    RainfallPrioritiesSchema, RainfallThresholds
)
from src.models.loggers import DeployedNode, DeployedNodeSchema
from src.models.monitoring import (
    MonitoringOnDemand, MonitoringMoms, MonitoringEvents,
    MonitoringEventAlerts, MonitoringReleases, 
    MonitoringReleasePublishers, MonitoringTriggers, 
    MonitoringTriggersMisc
)
from src.models.narratives import Narratives
from src.models.time_logs import TimeLogs
from src.utils.extra import retrieve_data_from_memcache

from src.utils.monitoring import (
    write_monitoring_moms_to_db, write_monitoring_on_demand_to_db,
    get_latest_monitoring_event_per_site, write_narratives_to_db
)

from ops.usab.optrig import rainfall, surficial, subsurface, earthquake


def insert_data_by_alert_type(datas=None):
    data_to_reset = []
    directory = APP_CONFIG["generated_alerts_path"]
    path = f"{directory}/usability_testing_saved_data.json"

    with open(path, "r") as fp:
        data_to_reset = json.load(fp)

    if not datas:
        datas = get_alert_data()

    for data in datas:
        ts = data["ts"]
        site_id = data["site_id"]
        alert_level = data["alert_level"]
        alert_type = data["alert_type"]
        source_id = None

        if alert_type == "subsurface":
            source_id = 1
            subsurface_data = data["data"]
            tsm_id = subsurface_data["tsm_id"]
            node_id = subsurface_data["node_id"]
            disp_alert = subsurface_data["disp_alert"]
            vel_alert = subsurface_data["vel_alert"]
            na_status = subsurface_data["na_status"]

            insert_tsm_alerts = TSMAlerts(
                ts=ts, tsm_id=tsm_id,
                alert_level=alert_level,
                ts_updated=ts
            )

            DB.session.add(insert_tsm_alerts)
            DB.session.flush()
            ta_id = insert_tsm_alerts.ta_id
            data_to_reset.append({
                "table_name": "tsm_alerts",
                "id": ta_id
            })
            insert_node_alerts = NodeAlerts(
                tsm_id=tsm_id, node_id=node_id,
                disp_alert=disp_alert, vel_alert=vel_alert,
                na_status=na_status
            )
            DB.session.add(insert_node_alerts)
            DB.session.flush()
            na_id = insert_node_alerts.na_id
            data_to_reset.append({
                "table_name": "node_alerts",
                "id": na_id
            })
        elif alert_type == "surficial":
            source_id = 2
            insert_marker_observation = MarkerObservations(
                site_id=site_id, ts=ts, meas_type="EVENT",
                data_source="SMS", reliability=1, weather="MAARAW",
                observer_name="TOPSSOFTWAREINFRA"
            )
            DB.session.add(insert_marker_observation)
            DB.session.flush()
            mo_id = insert_marker_observation.mo_id
            data_to_reset.append({
                "table_name": "marker_observations",
                "id": mo_id
            })
            marker_ids = marker_ids_per_site(site_id)
            insert_marker_data_and_alerts(
                mo_id, marker_ids, data_to_reset, alert_level, ts)

        elif alert_type == "rainfall":
            source_id = 3
            rain_data = data["data"]
            rain_alert = rain_data["rain_alert"]
            cumulative = rain_data["cumulative"]
            threshold = rain_data["threshold"]
            rain_id = rain_data["rain_id"]

            insert_rainfall_alerts = RainfallAlerts(
                ts=ts, site_id=site_id,
                rain_alert=rain_alert,
                cumulative=cumulative,
                threshold=threshold,
                rain_id=rain_id
            )
            DB.session.add(insert_rainfall_alerts)
            DB.session.flush()
            ra_id = insert_rainfall_alerts.ra_id
            data_to_reset.append({
                "table_name": "rainfall_alerts",
                "id": ra_id
            })
        elif alert_type == "earthquake":
            source_id = 4
            earthquake_data = data["data"]
            magnitude = earthquake_data["magnitude"]
            depth = earthquake_data["depth"]
            latitude = earthquake_data["latitude"]
            longitude = earthquake_data["longitude"]
            critical_distance = earthquake_data["critical_distance"]
            issuer = earthquake_data["issuer"]
            processed = earthquake_data["processed"]

            insert_eq_events = EarthquakeEvents(
                ts=ts, magnitude=magnitude, depth=depth,
                latitude=latitude, longitude=longitude,
                critical_distance=critical_distance,
                issuer=issuer, processed=processed
            )
            DB.session.add(insert_eq_events)
            DB.session.flush()
            eq_id = insert_eq_events.eq_id
            data_to_reset.append({
                "table_name": "earthquake_events",
                "id": eq_id
            })

            distance = earthquake_data["distance"]
            insert_eq_alerts = EarthquakeAlerts(
                eq_id=eq_id, site_id=site_id, distance=distance
            )
            DB.session.add(insert_eq_alerts)
            DB.session.flush()
            ea_id = insert_eq_alerts.ea_id
            data_to_reset.append({
                "table_name": "earthquake_alerts",
                "id": ea_id
            })
        elif alert_type == "on_demand":
            source_id = 5
            on_demand_data = data["data"]
            tech_info = on_demand_data["tech_info"]
            user_id = on_demand_data["reporter_id"]
            on_demand_data["request_ts"] = ts
            on_demand_data["site_id"] = site_id
            on_demand_data["alert_level"] = alert_level
            latest_event = get_latest_monitoring_event_per_site(
                site_id=site_id)
            event_id = latest_event.event_id
            narrative_id = write_narratives_to_db(
                site_id, ts, tech_info, 1,
                user_id, event_id
            )
            data_to_reset.append({
                "table_name": "narratives",
                "id": narrative_id
            })

            on_demand_data["narrative_id"] = narrative_id
            od_id = write_monitoring_on_demand_to_db(on_demand_data, tech_info)
            data_to_reset.append({
                "table_name": "monitoring_on_demand",
                "id": od_id
            })
        elif alert_type == "moms":
            moms_details = data["data"]
            moms_details["alert_level"] = alert_level
            moms_details["observance_ts"] = ts
            write_monitoring_moms_to_db(
                moms_details, site_id, is_usability_testing=True, data_to_reset=data_to_reset)

        if source_id:
            insert_operational_triggers(data, source_id, data_to_reset)

    with open(path, 'w') as outfile:
        json.dump(data_to_reset, outfile)
    return ""


def insert_operational_triggers(data, source_id):
    status = None
    message = ""
    try:
        ts = data["ts"]
        site_id = data["site_id"]
        ts_updated = data["ts"]
        alert_level = data["alert_level"]

        trigger_sym_id = retrieve_data_from_memcache("operational_trigger_symbols", {
            "alert_level": alert_level,
            "source_id": source_id
        }, retrieve_attr="trigger_sym_id")

        insert = OperationalTriggers(
            ts=ts, site_id=site_id,
            trigger_sym_id=trigger_sym_id,
            ts_updated=ts_updated
        )
        DB.session.add(insert)
        DB.session.flush()
        trigger_id = insert.trigger_id

        status = True
    except Exception as err:
        status = False
        message = f"Error message: {err}"
        print(err)

    return status, message


def get_alert_data():
    directory = APP_CONFIG["generated_alerts_path"]
    path = f"{directory}/usability_testing.json"
    with open(path) as f:
        data = json.load(f)

    return data


def marker_ids_per_site(site_id):
    data = Markers.query.filter(
        Markers.site_id == site_id).filter(Markers.in_use == 1).all()
    marker_ids = []
    for row in data:
        marker_ids.append(row.marker_id)
    return marker_ids


def insert_marker_data_and_alerts(mo_id, marker_ids, data_to_reset, alert_level, ts):
    new_marker_data = []
    data_ids = []
    for marker_id in marker_ids:
        random_measurement = random.randint(30, 99)
        insert_marker_data = MarkerData(
            mo_id=mo_id, marker_id=marker_id,
            measurement=random_measurement
        )
        DB.session.add(insert_marker_data)
        DB.session.flush()
        data_id = insert_marker_data.data_id
        data_to_reset.append({
            "table_name": "marker_data",
            "id": data_id
        })
        new_marker_data.append({
            "data_id": data_id,
            "measurement": random_measurement,
            "marker_id": marker_id
        })
        data_ids.append(data_id)

    if data_ids:
        data_id = random.choice(data_ids)
        value = next(
            (x for x in new_marker_data if x["data_id"] == data_id), None)
        marker_id = value["marker_id"]

        insert_marker_alerts = MarkerAlerts(
            time_delta=4, displacement=random.randint(1, 30),
            ts=ts, marker_id=marker_id,
            data_id=data_id, processed=1, alert_level=alert_level
        )
        DB.session.add(insert_marker_alerts)
        DB.session.flush()
        ma_id = insert_marker_alerts.ma_id
        data_to_reset.append({
            "table_name": "marker_alerts",
            "id": ma_id
        })

    return True


def reset_usability_testing_data():
    data_to_reset = None

    try:
        directory = APP_CONFIG["generated_alerts_path"]
        path = f"{directory}/usability_testing_saved_data.json"
        with open(path, "r") as fp:
            data_to_reset = json.load(fp)

        if data_to_reset:

            for row in data_to_reset:
                table_name = row["table_name"]
                id = row["id"]
                delete = None
                if table_name == "rainfall_alerts":
                    delete = RainfallAlerts.query.filter(
                        RainfallAlerts.ra_id == id).first()
                elif table_name == "tsm_alerts":
                    delete = TSMAlerts.query.filter(
                        TSMAlerts.ta_id == id).first()
                elif table_name == "node_alerts":
                    delete = NodeAlerts.query.filter(
                        NodeAlerts.na_id == id).first()
                elif table_name == "earthquake_alerts":
                    delete = EarthquakeAlerts.query.filter(
                        EarthquakeAlerts.ea_id == id).first()
                    eq_id = delete.eq_id
                    delete_eq_event = EarthquakeEvents.query.filter(
                        EarthquakeEvents.eq_id == eq_id).first()
                    DB.session.delete(delete_eq_event)
                elif table_name == "marker_alerts":
                    delete_marker_alerts = MarkerAlerts.query.filter(
                        MarkerAlerts.ma_id == id).first()
                    data_id = delete_marker_alerts.data_id
                    DB.session.delete(delete_marker_alerts)

                    marker_data = MarkerData.query.filter(
                        MarkerData.data_id == data_id).first()

                    mo_id = marker_data.mo_id
                    MarkerData.query.filter(
                        MarkerData.mo_id == mo_id).delete()

                    MarkerObservations.query.filter(
                        MarkerObservations.mo_id == mo_id).delete()
                elif table_name == "narratives":
                    Narratives.query.filter(
                        Narratives.id == id).delete()
                elif table_name == "monitoring_on_demand":
                    MonitoringOnDemand.query.filter(
                        MonitoringOnDemand.od_id == id).delete()
                elif table_name == "monitoring_moms":
                    MonitoringMoms.query.filter(
                        MonitoringMoms.moms_id == id).delete()
                elif table_name == "operational_triggers":
                    delete = OperationalTriggers.query.filter(
                        OperationalTriggers.trigger_id == id).first()

                if delete:
                    DB.session.delete(delete)

                DB.session.commit()
        with open(path, 'w') as outfile:
            json.dump([], outfile)

        print("DONE")
    except Exception as err:
        print(err)

    return ""


def save_time_logs(user_id, action, remarks):
    try:
        is_live_mode = APP_CONFIG["is_live_mode"]

        if not is_live_mode:

            mia_ts = datetime.now()
            res = urlopen("http://just-the-time.appspot.com/")
            result = res.read().strip()
            result_str = result.decode("utf-8")
            actual_ts = pd.to_datetime(result_str)+timedelta(hours=8)

            insert = TimeLogs(
                user_id=user_id, action=action,
                actual_ts=actual_ts, mia_ts=mia_ts
            )
            DB.session.add(insert)
            DB.session.commit()
    except Exception as err:
        DB.session.rollback()
        print(err)
    return ""


def insert_scenario_group(updated_data):
    directory = APP_CONFIG["usability_testing_path"]
    path = f"{directory}/scenario_group.json"

    with open(path, 'w') as outfile:
        json.dump(updated_data, outfile)
    return ""


def get_scenarion_groups_data():
    usability_testing_datas = []
    directory = APP_CONFIG["usability_testing_path"]
    path = f"{directory}/scenario_group.json"

    with open(path, "r") as fp:
        usability_testing_datas = json.load(fp)

    return usability_testing_datas


def get_all_sensors_data():
    tsm_query = TSMSensors.query.filter(TSMSensors.date_deactivated == None).all()
    tsm_result = TSMSensorsSchema(many=True).dump(tsm_query)

    deployed_node_query = DeployedNode.query.all()
    deployed_node_result = DeployedNodeSchema(
        many=True).dump(deployed_node_query)

    rainfall_gauges_query = RainfallGauges.query.filter(RainfallGauges.date_deactivated == None).all()
    rainfall_gauges_result = RainfallGaugesSchema(
        many=True).dump(rainfall_gauges_query)

    rainfall_priorities_query = RainfallPriorities.query.all()
    rainfall_priorities_result = RainfallPrioritiesSchema(
        many=True).dump(rainfall_priorities_query)

    return_data = {
        "tsm_sensors": tsm_result,
        "deployed_node": deployed_node_result,
        "rainfall_gauges": rainfall_gauges_result,
        "rainfall_priorities": rainfall_priorities_result
    }

    return return_data


def start_scenario(scenario_data=None):
    return_data = []

    if scenario_data:

        for data in scenario_data:
            alert_type = data["type"]
            alert_data = data["type_data"]

            if alert_type == "subsurface":
                alert_level = int(alert_data["alert_level"])
                site_id = int(alert_data["site_id"])
                ts = pd.to_datetime(alert_data["ts"])
                subsurface_data = subsurface(site_id, ts, alert_level)
                return_data.append({
                    "type": alert_type,
                    "data": subsurface_data.to_dict(orient="records"),
                    "ts": alert_data["ts"],
                    "site_id": site_id
                })

            elif alert_type == "surficial":
                alert_level = int(alert_data["alert_level"])
                site_id = alert_data["site_id"]
                ts = pd.to_datetime(alert_data["ts"])

                surficial_data = surficial(site_id, ts, alert_level)
                return_data.append({
                    "type": alert_type,
                    "data": surficial_data.to_dict(orient="records"),
                    "ts": alert_data["ts"],
                    "site_id": site_id,
                    "alert_level": alert_level
                })

            elif alert_type == "rainfall":
                rain_alert = alert_data["rain_alert"]
                rain_id = int(alert_data["rain_id"])
                site_id = alert_data["site_id"]
                ts = pd.to_datetime(alert_data["ts"])

                rainfall_data = rainfall(
                    site_id, ts, rain_id, rain_alert=rain_alert)
                return_data.append({
                    "type": alert_type,
                    "data": rainfall_data.to_dict(orient="records"),
                    "ts": alert_data["ts"],
                    "site_id": site_id
                })

            elif alert_type == "earthquake":
                site_id = alert_data["site_id"]
                ts = pd.to_datetime(alert_data["ts"])

                earthquake_data = earthquake(site_id, ts)
                return_data.append({
                    "type": alert_type,
                    "data": earthquake_data.to_dict(orient="records"),
                    "ts": alert_data["ts"],
                    "site_id": site_id
                })

            elif alert_type == "on_demand":
                alert_level = int(alert_data["alert_level"])
                reason = alert_data["reason"]
                reporter_id = int(alert_data["reporter_id"])
                request_ts = alert_data["request_ts"]
                source_id = 5
                site_id = alert_data["site_id"]
                tech_info = alert_data["tech_info"]

                on_demand_data = {
                    "alert_level": alert_level,
                    "reason": reason,
                    "reporter_id": reporter_id,
                    "request_ts": request_ts,
                    "site_id": site_id
                }

                latest_event = get_latest_monitoring_event_per_site(
                    site_id=site_id)
                event_id = latest_event.event_id
                narrative_id = write_narratives_to_db(
                    site_id, request_ts, tech_info, 1,
                    reporter_id, event_id
                )

                on_demand_data["narrative_id"] = narrative_id
                write_monitoring_on_demand_to_db(
                    on_demand_data, tech_info)

                op_trigger_data = {
                    "ts": request_ts,
                    "site_id": site_id,
                    "ts_updated": request_ts,
                    "alert_level": alert_level
                }
                insert_operational_triggers(
                    op_trigger_data, source_id)

                return_data.append({
                    "type": alert_type,
                    "data": alert_data,
                    "ts": request_ts
                })
            elif alert_type == "moms":
                site_id = data["site"]["value"]
                moms_list = data["moms_list"]
                source_id = None

                moms_data = {
                    "site": data["site"],
                    "moms_list": moms_list,
                    "moms_list_notice": "usability testing"
                }

                return_data.append({
                    "type": alert_type,
                    "data": moms_data
                })

                for moms_details in moms_list:
                    write_monitoring_moms_to_db(
                        moms_details, site_id)

        # save_time_logs(user_id, "started_scenario", scenario_name)

    return return_data


def execute_update_machine_time(updated_machine_time=None):
    if updated_machine_time:
        sudo_password = APP_CONFIG["machine_password"]
        set_ntp = "timedatectl set-ntp 0"
        os.system('echo %s|sudo -S %s' % (sudo_password, set_ntp))
        set_dt = f'timedatectl set-time "{updated_machine_time}"'
        os.system('echo %s|sudo -S %s' % (sudo_password, set_dt))
        print("Executed update machine time")
        
    return "Executed update machine time."

    