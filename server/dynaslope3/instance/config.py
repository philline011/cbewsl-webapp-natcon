"""
WARNING: CONTAINS SENSITIVE INFORMATION LIKE DATABASE CONNECTIONS
DO NOT COMMIT AS MUCH AS POSSIBLE

Contains configuration variables to be used
in initializing Flask App instance
"""
# main
# ROOT_HOST = "si:softwareinfra@192.168.150.112"

# sandbox
# ROOT_HOST = "root:senslope@192.168.150.253"

# local
ROOT_HOST = "david:J0hnd@v!d1234@127.0.0.1"

# ASTI Cloud
# ROOT_HOST = "cbewsl:cb3wsls3rv3r@dynaslope.phivolcs.dost.gov.ph"
SQLALCHEMY_DATABASE_URI = f"mysql://{ROOT_HOST}/commons_db"
SQLALCHEMY_BINDS = {
    "senslopedb": f"mysql://{ROOT_HOST}/analysis_db",
    "comms_db_3": f"mysql://{ROOT_HOST}/comms_db",
    "ewi_db": f"mysql://{ROOT_HOST}/ewi_db",
    "commons_db": f"mysql://{ROOT_HOST}/commons_db",
}
SCHEMA_DICT = {
    "senslopedb": "analysis_db",
    "comms_db_3": "comms_db",
    "ewi_db": "ewi_db",
    "commons_db": "commons_db",
}

SECRET_KEY = "secret"

MACHINE_PASSWORD = "jdguevarra101"

EMAILS = {
    "director_and_head_emails": ["rusolidum@phivolcs.dost.gov.ph", "asdaag48@gmail.com"],
    "dynaslope_groups": [
        "phivolcs-dynaslope@googlegroups.com",
        "phivolcs-senslope@googlegroups.com"
    ],
    "dev_email": "dynaslopeswat@gmail.com",
    "dev_password": "dynaslopeswat",
    "monitoring_email": "dewsl.monitoring2@gmail.com",
    "monitoring_password": "landslides1234",
}
