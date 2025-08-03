import axios from 'axios';

const API_BASE_URL = "http://192.168.29.58:3000"; 

// Create axios instance with default config
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
  signupUser: async (userData, token) => {
    const response = await api.post('/authSignUp/signup', userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Get user profile
  getUserProfile: async (token) => {
    const response = await api.get('/authSignUp/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default api; 