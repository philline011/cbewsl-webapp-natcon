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

export const forgotPassword = (data, callback) => {
    axios.post(`${API_URL}/api/forgot_password`, data).then((response) => {
        callback(response.data)
    }).catch((error) => {
    
    });
}

export const verifyOTP = (data, callback) => {
    axios.post(`${API_URL}/api/verify_otp`, data).then((response) => {
        callback(response.data)
    }).catch((error) => {
    
    });
}