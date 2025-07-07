import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
const API_VERSION = "/api/v1";

// Response interface
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// API Client Class
class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: `${Constants.expoConfig?.extra?.API_URL || "http://localhost:3000"}/api/v1`,
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Request interceptor to add auth token
        this.client.interceptors.request.use(
            async (config) => {
                const token = await AsyncStorage.getItem("authToken");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error) => {
                if (error.response?.status === 401) {
                    // Handle unauthorized access
                    AsyncStorage.removeItem("authToken");
                    // You can dispatch a logout action here
                }
                return Promise.reject(error);
            }
        );
    }

    // Generic request method
    private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.request(config);
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || "An error occurred",
            };
        }
    }

    // GET request
    async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: "GET",
            url,
            params,
        });
    }

    // POST request
    async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: "POST",
            url,
            data,
        });
    }

    // PUT request
    async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: "PUT",
            url,
            data,
        });
    }

    // DELETE request
    async delete<T>(url: string): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: "DELETE",
            url,
        });
    }

    // File upload
    async upload<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: "POST",
            url,
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

// API Service Classes
export class AuthService {
    static async login(email: string, password: string) {
        return apiClient.post("/auth/login", { email, password });
    }

    static async register(userData: { email: string; password: string; role: "freelancer" | "client" }) {
        return apiClient.post("/auth/register", userData);
    }

    static async logout() {
        return apiClient.post("/auth/logout");
    }

    static async getProfile() {
        return apiClient.get("/auth/profile");
    }

    static async updateProfile(profileData: any) {
        return apiClient.put("/auth/profile", profileData);
    }
}

export class JobService {
    static async getJobs(params?: any) {
        return apiClient.get("/jobs", params);
    }

    static async getJob(id: string) {
        return apiClient.get(`/jobs/${id}`);
    }

    static async createJob(jobData: any) {
        return apiClient.post("/jobs", jobData);
    }

    static async updateJob(id: string, jobData: any) {
        return apiClient.put(`/jobs/${id}`, jobData);
    }

    static async deleteJob(id: string) {
        return apiClient.delete(`/jobs/${id}`);
    }

    static async getMyJobs(params?: any) {
        return apiClient.get("/jobs/my/jobs", params);
    }

    static async getCategories() {
        return apiClient.get("/jobs/categories");
    }
}

export class ServiceService {
    static async getServices(params?: any) {
        return apiClient.get("/services", params);
    }

    static async getService(id: string) {
        return apiClient.get(`/services/${id}`);
    }

    static async createService(serviceData: any) {
        return apiClient.post("/services", serviceData);
    }

    static async updateService(id: string, serviceData: any) {
        return apiClient.put(`/services/${id}`, serviceData);
    }

    static async deleteService(id: string) {
        return apiClient.delete(`/services/${id}`);
    }

    static async getMyServices(params?: any) {
        return apiClient.get("/services/my/services", params);
    }
}

export class ProposalService {
    static async getProposals(params?: any) {
        return apiClient.get("/proposals", params);
    }

    static async getProposal(id: string) {
        return apiClient.get(`/proposals/${id}`);
    }

    static async createProposal(proposalData: any) {
        return apiClient.post("/proposals", proposalData);
    }

    static async updateProposal(id: string, proposalData: any) {
        return apiClient.put(`/proposals/${id}`, proposalData);
    }

    static async deleteProposal(id: string) {
        return apiClient.delete(`/proposals/${id}`);
    }

    static async getMyProposals(params?: any) {
        return apiClient.get("/proposals/my/proposals", params);
    }

    static async getJobProposals(jobId: string, params?: any) {
        return apiClient.get(`/proposals/job/${jobId}`, params);
    }
}

export class MessageService {
    static async getMyChats(params?: { page?: number; limit?: number }) {
        return apiClient.get("/messages/chats", params);
    }

    static async getChatMessages(chatId: string, params?: { page?: number; limit?: number }) {
        return apiClient.get(`/messages/chats/${chatId}`, params);
    }

    static async sendMessage(chatId: string, messageData: { content: string }) {
        return apiClient.post(`/messages/chats/${chatId}`, messageData);
    }

    static async createChat(userId: string) {
        return apiClient.post("/messages/chats", { userId });
    }

    static async markMessagesAsRead(chatId: string) {
        return apiClient.put(`/messages/chats/${chatId}/read`);
    }

    static async getUnreadCount() {
        return apiClient.get("/messages/unread-count");
    }
}

export class ReviewService {
    static async getReviews(params?: { page?: number; limit?: number; userId?: string }) {
        return apiClient.get("/reviews", params);
    }

    static async getReviewById(id: string) {
        return apiClient.get(`/reviews/${id}`);
    }

    static async createReview(reviewData: any) {
        return apiClient.post("/reviews", reviewData);
    }

    static async updateReview(id: string, reviewData: any) {
        return apiClient.put(`/reviews/${id}`, reviewData);
    }

    static async deleteReview(id: string) {
        return apiClient.delete(`/reviews/${id}`);
    }

    static async getUserReviews(userId: string, params?: { page?: number; limit?: number }) {
        return apiClient.get(`/reviews/user/${userId}`, params);
    }
}

export class ProfileService {
    static async uploadProfileImage(imageUri: string) {
        const formData = new FormData();
        formData.append("image", {
            uri: imageUri,
            type: "image/jpeg",
            name: "profile.jpg",
        } as any);

        return apiClient.upload("/profile/upload-image", formData);
    }
}

// AI Integration Services (Placeholders for future implementation)
export class AIService {
    // TODO: Implement OpenAI ChatGPT integration for chat assistance
    static async getChatSuggestion(message: string) {
        // Placeholder for OpenAI integration
        return apiClient.post("/ai/chat-suggestion", { message });
    }

    // TODO: Implement Affinda Resume Parser integration
    static async parseResume(resumeFile: any) {
        // Placeholder for Affinda integration
        const formData = new FormData();
        formData.append("resume", resumeFile);
        return apiClient.upload("/ai/parse-resume", formData);
    }

    // TODO: Implement Microsoft Azure Computer Vision for image moderation
    static async moderateImage(imageUri: string) {
        // Placeholder for Azure Computer Vision integration
        const formData = new FormData();
        formData.append("image", {
            uri: imageUri,
            type: "image/jpeg",
            name: "image.jpg",
        } as any);
        return apiClient.upload("/ai/moderate-image", formData);
    }

    // TODO: Implement LibreTranslate for language translation
    static async translateText(text: string, targetLanguage: string) {
        // Placeholder for LibreTranslate integration
        return apiClient.post("/ai/translate", { text, targetLanguage });
    }

    // TODO: Implement sentiment analysis for reviews
    static async analyzeSentiment(text: string) {
        // Placeholder for sentiment analysis
        return apiClient.post("/ai/sentiment-analysis", { text });
    }
}

export class CategoryService {
    static async getCategories() {
        return apiClient.get("/jobs/categories");
    }
}

export default apiClient;
