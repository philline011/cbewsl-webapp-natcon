import {API_URL} from '../config'
import axios from 'axios'

export const getLatestCandidatesAndAlerts = (callback) => {
    axios.get(`${API_URL}/api/monitoring/candidate_alerts`).then((response) => {
        callback(response.data)
    }).catch((error) => {
    
    });
}

export const validateAlert = (callback, data) => {
    axios.post(`${API_URL}/api/monitoring/update_alert_status`, data).then((response) => {
        callback(response.data)
    }).catch((error) => {
    
    });
}