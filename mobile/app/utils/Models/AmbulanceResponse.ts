// Individual ambulance data interface
export interface Ambulance {
    license_plate: string;
    latitude: number;
    longitude: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    is_available: boolean;
}

// API response interface
export interface AmbulanceResponse {
    message: string;
    data: Ambulance[];
}

// Error response interface
export interface AmbulanceErrorResponse {
    message: string;
    error?: any;
}