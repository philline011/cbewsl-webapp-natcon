import {API_URL} from '../config'
import axios from 'axios'

export const signUp = (data, callback) => {
    axios.post(`${API_URL}/api/signup`, data).then((response) => {
        callback(response.data)
    }).catch((error) => {
    
    });
}

export const signIn = (data, callback) => {
    axios.post(`${API_URL}/api/signin`, data).then((response) => {
        callback(response.data)
    }).catch((error) => {
    
    });
}