export interface UserProfile {
    id: string;
    name: string;
    age?: number;
    disease?: string;
    phone?: string;
    email: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProfileResponse {
    success: boolean;
    data?: UserProfile;
    message?: string;
    error?: string;
}
