import {API_URL} from '../config'
import axios from 'axios'

export const signUp = (data, callback) => {
    axios.post(`${API_URL}/api/signup`, data).then((response) => {
        callback(response.data)
    }).catch((error) => {
    
    });
}