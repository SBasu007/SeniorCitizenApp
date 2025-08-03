import axios from 'axios';

const API_BASE_URL = "http://192.168.31.56:3000"; 

// Create axios instance with default config
/**
 * this is an axios instance 
 * @param baseurl for fixing url
 * @param timeout for setting a timeout
 * @param headers for setting a default content type
 * @author s-sammm-y
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const authAPI = {
  // Sign up user with data
  /**
   * @param {*} userData gets user data from the api call email,password
   * @param {*} token gets session token for verifying user
   * @returns api response
   */
  signupUser: async (userData, token) => {
    const response = await api.post('/authSignUp/signup', userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default api; 