// API Configuration
export const API_BASE_URL = "http://localhost:3000/api/v1";

// API Endpoints
export const ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        PROFILE: "/auth/profile",
    },
    PROPOSALS: {
        BASE: "/proposals",
        MY_PROPOSALS: "/proposals/my/proposals",
        JOB_PROPOSALS: "/proposals/job",
        STATUS: "/proposals/{id}/status",
    },
    JOBS: {
        BASE: "/jobs",
    },
    MESSAGES: {
        BASE: "/messages",
    },
};

// Common headers
export const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
});
