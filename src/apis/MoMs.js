import {API_URL} from '../config'
import axios from 'axios'

export const getFeatures = (callback) => {
    axios.get(`${API_URL}/api/manifestations_of_movement/get_moms_features/lpa`).then((response) => {
        callback(response.data)
    }).catch((error) => {
    
    });
}

export const getInstances = (callback) => {
    axios.get(`${API_URL}/api/manifestations_of_movement/get_moms_instances/lpa`).then((response) => {
        callback(response.data)
    }).catch((error) => {
    
    });
}