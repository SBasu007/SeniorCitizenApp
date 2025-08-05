import axios from "axios";
import { ApiResponse } from "./Models/ApiResponse";
import { AmbulanceResponse } from "./Models/AmbulanceResponse";
import * as Location from 'expo-location'

const API_BASE_URL = "http://192.168.31.56:3000"

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
})
// Interfaces for Video Recommendations
export interface RecommendedVideo {
    id: string;
    title: string;
    channelTitle: string;
    duration: string;
    viewCount: string;
    description: string;
    thumbnail: string;
    url: string;
    publishedAt: string;
}

export interface VideoRecommendationData {
    disease: string;
    videos: RecommendedVideo[];
    totalCount: number;
}

export interface VideoRecommendationResponse {
    success: boolean;
    data?: VideoRecommendationData;
    message?: string;
    error?: string;
}

// Auth API
export const authApi = {
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

// Profile API
export const profileApi = {
    /* GET  /profile/:userId  →  { success, data } */
    getProfile: async (userId: string, token: string) => {
        try {
            const res = await api.get(`/profile/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;             // { success: boolean, data: {...} }
        } catch (error) {
            throw error;
        }
    },

    /* PUT  /profile/:userId  →  { success, data } */
    updateProfile: async (userId: string, profileData: any, token: string) => {
        try {
            const res = await api.put(`/profile/${userId}`, profileData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    },
};

// Recommendations API
export const recommendationsApi = {
    getVideoRecommendations: async (
        userId: string, 
        disease: string, 
        token: string, 
        limit: number = 10
    ): Promise<VideoRecommendationResponse> => {
        try {
            const response = await api.get<VideoRecommendationResponse>(
                `/recommendations/videos/${userId}`, 
                {
                    params: { disease, limit },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching video recommendations:', error);
            throw error;
        }
    },

    getGeneralRecommendations: async (
        token: string, 
        limit: number = 10
    ): Promise<VideoRecommendationResponse> => {
        try {
            const response = await api.get<VideoRecommendationResponse>(
                '/recommendations/videos/general', 
                {
                    params: { limit },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching general recommendations:', error);
            throw error;
        }
    }
};

// Export the axios instance for other uses
export default api;
