import { getToken } from "./storage";

const API_URL = (process.env.EXPO_PUBLIC_API_URL || "http://192.168.6.37:3000/api/v1");

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

interface UserProfile {
    _id: string;
    email: string;
    role: 'freelancer' | 'client';
    created_at: string;
    profile?: {
        name: string;
        bio?: string;
        location?: string;
        profile_image_url?: string;
        skills?: string[];
    };
}

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

// Get all users
export const getAllUsers = async (
    page = 1,
    limit = 20,
    search?: string,
    role?: 'freelancer' | 'client'
): Promise<ApiResponse<{ users: UserProfile[]; pagination: PaginationInfo }>> => {
    try {
        const token = await getToken();
        
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        
        if (search) params.append('search', search);
        if (role) params.append('role', role);

        const response = await fetch(`${API_URL}/users?${params.toString()}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch users");
        }

        return data;
    } catch (error: any) {
        console.error("Get users error:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch users",
        };
    }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<ApiResponse<UserProfile>> => {
    try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch user");
        }

        return data;
    } catch (error: any) {
        console.error("Get user error:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch user",
        };
    }
};