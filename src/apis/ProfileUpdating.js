import {API_URL} from '../config'
import axios from 'axios'

export const updateProfile = (data, callback) => {
    axios.post(`${API_URL}/api/users/update_profile`, data).then((response) => {
        callback(response.data)
    }).catch((error) => {
    
    });
}