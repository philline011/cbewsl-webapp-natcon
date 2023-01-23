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