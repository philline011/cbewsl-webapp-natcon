import {API_URL} from '../config'
import axios from 'axios'

export const getSurficialData = (data,callback) => {
    axios.get(`${API_URL}/api/surficial/get_surficial_plot_data/mar/${data.startDate}/${data.endDate}`).then((response) => {
        callback(response.data)
    }).catch((error) => {
    
    });
}

export const sendMeasurement = (data,callback) => {
    axios.post(`${API_URL}/api/surficial/insert_web`, data).then((response) => {
        callback(response.data)
    }).catch((error) => {
    
    });
}