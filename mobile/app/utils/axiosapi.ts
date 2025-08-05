import axios from "axios";
import { ApiResponse } from "./Models/ApiResponse";
import { AmbulanceResponse } from "./Models/AmbulanceResponse";
import * as Location from 'expo-location'

const API_BASE_URL = "https://seniorcitizenapp.onrender.com"

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
})
export const authApi  = {
    signupUser: async (userData: any, token: string): Promise<ApiResponse<any>> => {
        try {
            const response = await api.post<ApiResponse<any>>("/authSignUp/signup", userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
}

/**
 * Only for Services booking
 */
export const ServiceApi = {
    getLocation: async (): Promise<Location.LocationObject> => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Permission needed');
        }

        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
        });

            return location;
        } catch (error) {
            throw error; 
        }
    },

    availableAmbulances: async (token: string): Promise<AmbulanceResponse> => {
        try {
            const response = await api.get<AmbulanceResponse>("available-ambulances/ambulances", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

// axios.api.ts
export const profileApi = {
  /* GET  /profile/:userId  →  { success, data } */
  getProfile: async (userId: string, token: string) => {
    const res = await api.get(`/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;             // { success: boolean, data: {...} }
  },
};
