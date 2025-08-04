import axios from 'axios';

const API_BASE_URL = "http://192.168.31.56:3000"; 

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
  signupUser: async (userData, token) => {
    const response = await api.post('/authSignUp/signup', userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

// Profile API functions
export const profileAPI = {
  /**
   * Update user profile
   * @param {string} userId - User ID from Clerk
   * @param {object} profileData - Profile data to update
   * @param {string} token - Session token for authentication
   * @returns {Promise} API response
   */
  updateProfile: async (userId, profileData, token) => {
    const response = await api.put(`/profile/update/${userId}`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Get user profile
   * @param {string} userId - User ID from Clerk
   * @param {string} token - Session token for authentication
   * @returns {Promise} API response
   */
  getProfile: async (userId, token) => {
    const response = await api.get(`/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default api;
