import axios from "axios";
import { ApiResponse } from "./Models/ApiResponse";
import { AmbulanceResponse } from "./Models/AmbulanceResponse";

const API_BASE_URL = "http://192.168.31.56:3000"

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