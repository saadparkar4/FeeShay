import axios from "axios";
import { getToken } from "./storage";

export const mainAPI = axios.create({
    baseURL: "http://localhost:3000/api/v1",
});

mainAPI.interceptors.request.use(async (payload) => {
    const token = await getToken();
    if (token) {
        payload.headers.Authorization = `Bearer ${token}`;
    }

    return payload;
});

// Auth endpoints
export const getProfile = () => mainAPI.get("/auth/profile");
export const updateProfile = (data: any) => mainAPI.put("/auth/profile", data);
export const changePassword = (data: any) => mainAPI.put("/auth/change-password", data);

// Jobs endpoints
export const getJobs = () => mainAPI.get("/jobs");
export const getJobById = (id: string) => mainAPI.get(`/jobs/${id}`);
export const createJob = (data: any) => mainAPI.post("/jobs", data);
export const updateJob = (id: string, data: any) => mainAPI.put(`/jobs/${id}`, data);
export const deleteJob = (id: string) => mainAPI.delete(`/jobs/${id}`);

// Services endpoints
export const getServices = () => mainAPI.get("/services");
export const getServiceById = (id: string) => mainAPI.get(`/services/${id}`);
export const createService = (data: any) => mainAPI.post("/services", data);
export const updateService = (id: string, data: any) => mainAPI.put(`/services/${id}`, data);
export const deleteService = (id: string) => mainAPI.delete(`/services/${id}`);

// Proposals endpoints
export const getProposals = () => mainAPI.get("/proposals");
export const getProposalById = (id: string) => mainAPI.get(`/proposals/${id}`);
export const createProposal = (data: any) => mainAPI.post("/proposals", data);
export const updateProposal = (id: string, data: any) => mainAPI.put(`/proposals/${id}`, data);
export const deleteProposal = (id: string) => mainAPI.delete(`/proposals/${id}`);

// Messages endpoints
export const getChats = () => mainAPI.get("/messages/chats");
export const getMessages = (chatId: string) => mainAPI.get(`/messages/${chatId}`);
export const sendMessage = (chatId: string, data: any) => mainAPI.post(`/messages/${chatId}`, data);

// Reviews endpoints
export const getReviews = () => mainAPI.get("/reviews");
export const createReview = (data: any) => mainAPI.post("/reviews", data);
export const updateReview = (id: string, data: any) => mainAPI.put(`/reviews/${id}`, data);
export const deleteReview = (id: string) => mainAPI.delete(`/reviews/${id}`);

// Health check
export const healthCheck = () => mainAPI.get("/health");

// Categories endpoint
export const getCategories = () => mainAPI.get("/jobs/categories");
