import {API_URL} from '../config'
import axios from 'axios'

export function saveFeedback(input, callback) {
    const api_link = `${API_URL}/api/feedback/save_feedback`;
    axios
      .post(api_link, input)
      .then(response => {
        const {data} = response;
        console.log('Save Feedback', data);
        callback(data);
      })
      .catch(error => {
        console.error(error);
      });
  }