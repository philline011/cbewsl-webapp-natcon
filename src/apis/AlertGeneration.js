import {API_URL} from '../config'
import axios from 'axios'

export const getLatestCandidatesAndAlerts = (callback) => {
    axios.get(`${API_URL}/api/monitoring/candidate_alerts`).then((response) => {
        callback(response.data)
    }).catch((error) => {
    
    });
}

export const validateAlert = (callback, state, data) => {
    console.log("data:", data);
    axios.post(`${API_URL}/api/monitoring/update_alert_status`, data).then((response) => {
        // callback(response.data);
        callback(state);
        console.log(response.data);
    }).catch((error) => {
    
    });
}

export const generateAlert = (data) => {
    axios.post(`${API_URL}/api/monitoring/insert_ewi`, data).then((response) => {
        // callback(response.data);
        console.log(response);
    }).catch((error) => {
    
    });
}

export function getCandidateAlert(callback) {
    const api_link = `${API_URL}/api/monitoring/candidate_alerts`;
    axios
        .get(api_link)
        .then(response => {
            const { data } = response;
            console.log(`Candidate alert`, data);
            callback(data);
        })
        .catch(error => {
            console.error(error);
        });
}

export function updateAlertStatus(input, callback) {
    const api_link = `${API_URL}/api/monitoring/update_alert_status`;
    axios
        .post(api_link, input)
        .then(response => {
            const { data } = response;
            console.log('Updated alert status', data);
            callback(data);
        })
        .catch(error => {
            console.error(error);
        });
}

export function releaseAlert(input, callback) {
    const api_link = `${API_URL}/api/monitoring/insert_ewi`;
    axios
        .post(api_link, input)
        .then(response => {
            const { data } = response;
            console.log('Release alert', data);
            callback(data);
        })
        .catch(error => {
            console.error(error);
        });
}

export function sendMessage(input, callback) {
    const api_link = `${API_URL}/message/send_ewi`;
    axios
        .post(api_link, input)
        .then(response => {
            const { data } = response;
            console.log('Send EWI Message', data);
            callback(data);
        })
        .catch(error => {
            console.error(error);
        });
}

export function getReleasedMessages(release_id, callback) {
    const api_link = `${API_URL}/api/monitoring/get_release_acknowledgement/${release_id}`;
    axios
        .get(api_link)
        .then(response => {
            const { data } = response;
            console.log(`Release ack`, data);
            callback(data);
        })
        .catch(error => {
            console.error(error);
        });
}

export function getTempMoms(callback) {
    const api_link = `${API_URL}/api/manifestations_of_movement/get_temp_moms`;
    axios
        .get(api_link)
        .then(response => {
            const { data } = response;
            console.log(`get temp moms`, data);
            callback(data);
        })
        .catch(error => {
            console.error(error);
        });
}


export function updateMoms(input, callback) {
    const api_link = `${API_URL}/api/manifestations_of_movement/write_monitoring_moms_to_db`;
    axios
        .post(api_link, input)
        .then(response => {
            const { data } = response;
            console.log('Updated moms', data);
            callback(data);
        })
        .catch(error => {
            console.error(error);
        });
}

export function getContacts(callback) {
    const api_link = `${API_URL}/message/contacts`;
    axios
        .get(api_link)
        .then(response => {
            const { data } = response;
            console.log('Updated moms', data);
            callback(data);
        })
        .catch(error => {
            console.error(error);
        });
}

export function insertOnDemandToDb(on_demand_data, callback) {
    const api_link = `${API_URL}/api/monitoring/save_on_demand_data`;

    axios.post(api_link, on_demand_data)
        .then((response) => {
            const { data } = response;
            if (callback !== null) {
                console.log("On Demand Insert result", data);
                callback(data);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export function checkLatestSiteEventIfHasOnDemand(site_id, callback) {
    const api_link = `${API_URL}/api/monitoring/check_if_current_site_event_has_on_demand/${site_id}`;
    axios
        .get(api_link)
        .then(response => {
            const { data } = response;
            console.log('check if has on demand', data);
            callback(data);
        })
        .catch(error => {
            console.error(error);
        });
}

export function getEarthquakeEventsForLast24hrs(json_data, callback) {
    const api_link = `${API_URL}/api/analysis/get_earthquake_events_within_one_day`;
    axios.post(api_link, json_data)
        .then((response) => {
            const { data } = response;
            if (callback !== null) {
                console.log("24hrs eq event", data);
                callback(data);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
