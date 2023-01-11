import {API_URL} from '../config'
import axios from 'axios'

export const getEvents = (callback) => {
    axios.get(`${API_URL}/api/events/get_all_events`).then((response) => {
        callback(response.data)
    }).catch((error) => {
    
    });
}

export const addEvent = (data,callback) => {
    axios.post(`${API_URL}/api/events/save_activity`, data).then((response) => {
        callback(response.data)
    }).catch((error) => {
    
    });
}

export const deleteEvent = (data,callback) => {
    axios.post(`${API_URL}/api/events/delete_activity`, data).then((response) => {
        callback(response.data)
    }).catch((error) => {
    
    });
}