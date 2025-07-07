import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API Configuration
const API_BASE_URL = "http://localhost:5000/api/v1";

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error getting auth token:", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear storage
            await AsyncStorage.removeItem("authToken");
            await AsyncStorage.removeItem("user");
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data: { email: string; password: string; role: "freelancer" | "client"; name: string }) => apiClient.post("/auth/register", data),

    login: (data: { email: string; password: string }) => apiClient.post("/auth/login", data),

    getProfile: () => apiClient.get("/auth/profile"),

    updateProfile: (data: any) => apiClient.put("/auth/profile", data),

    changePassword: (data: { currentPassword: string; newPassword: string }) => apiClient.put("/auth/change-password", data),
};

// Jobs API
export const jobsAPI = {
    getAll: (params?: { page?: number; limit?: number; status?: string; category?: string; budget_min?: number; budget_max?: number; search?: string; is_internship?: boolean }) =>
        apiClient.get("/jobs", { params }),

    getById: (id: string) => apiClient.get(`/jobs/${id}`),

    create: (data: { title: string; description: string; category?: string; budget_min?: number; budget_max?: number; is_internship?: boolean }) => apiClient.post("/jobs", data),

    update: (id: string, data: any) => apiClient.put(`/jobs/${id}`, data),

    delete: (id: string) => apiClient.delete(`/jobs/${id}`),

    getMyJobs: (params?: { page?: number; limit?: number; status?: string }) => apiClient.get("/jobs/my/jobs", { params }),

    getCategories: () => apiClient.get("/jobs/categories"),
};

// Services API
export const servicesAPI = {
    getAll: (params?: { page?: number; limit?: number; status?: string; category?: string; price_min?: number; price_max?: number; search?: string; freelancer?: string }) =>
        apiClient.get("/services", { params }),

    getById: (id: string) => apiClient.get(`/services/${id}`),

    create: (data: { title: string; description: string; category?: string; price?: number; delivery_time_days?: number }) => apiClient.post("/services", data),

    update: (id: string, data: any) => apiClient.put(`/services/${id}`, data),

    delete: (id: string) => apiClient.delete(`/services/${id}`),

    getMyServices: (params?: { page?: number; limit?: number; status?: string }) => apiClient.get("/services/my/services", { params }),
};

// Proposals API
export const proposalsAPI = {
    getAll: (params?: { page?: number; limit?: number; status?: string; job?: string; freelancer?: string }) => apiClient.get("/proposals", { params }),

    getById: (id: string) => apiClient.get(`/proposals/${id}`),

    create: (data: { job: string; cover_letter: string; proposed_price: number }) => apiClient.post("/proposals", data),

    update: (id: string, data: any) => apiClient.put(`/proposals/${id}`, data),

    delete: (id: string) => apiClient.delete(`/proposals/${id}`),

    getMyProposals: (params?: { page?: number; limit?: number; status?: string }) => apiClient.get("/proposals/my/proposals", { params }),

    getJobProposals: (jobId: string, params?: { page?: number; limit?: number; status?: string }) => apiClient.get(`/proposals/job/${jobId}`, { params }),

    updateStatus: (id: string, data: { status: string }) => apiClient.put(`/proposals/${id}/status`, data),
};

// Messages API
export const messagesAPI = {
    createChat: (data: { otherUserId: string }) => apiClient.post("/messages/chats", data),

    getMyChats: (params?: { page?: number; limit?: number }) => apiClient.get("/messages/chats", { params }),

    getChatMessages: (chatId: string, params?: { page?: number; limit?: number }) => apiClient.get(`/messages/chats/${chatId}/messages`, { params }),

    sendMessage: (chatId: string, data: { content: string; language?: string }) => apiClient.post(`/messages/chats/${chatId}/messages`, data),

    markAsRead: (chatId: string) => apiClient.put(`/messages/chats/${chatId}/read`),

    getUnreadCount: () => apiClient.get("/messages/unread-count"),

    deleteMessage: (messageId: string) => apiClient.delete(`/messages/messages/${messageId}`),
};

// Reviews API
export const reviewsAPI = {
    getAll: (params?: { page?: number; limit?: number; reviewee?: string; reviewer?: string; job?: string; rating?: number; sentiment?: string }) =>
        apiClient.get("/reviews", { params }),

    getById: (id: string) => apiClient.get(`/reviews/${id}`),

    create: (data: { reviewee: string; job?: string; rating: number; comment?: string }) => apiClient.post("/reviews", data),

    update: (id: string, data: { rating?: number; comment?: string }) => apiClient.put(`/reviews/${id}`, data),

    delete: (id: string) => apiClient.delete(`/reviews/${id}`),

    getUserReviews: (userId: string, params?: { page?: number; limit?: number; type?: "received" | "given" }) => apiClient.get(`/reviews/user/${userId}`, { params }),
};

// Health check
export const healthAPI = {
    check: () => apiClient.get("/health"),
};

export default apiClient;
