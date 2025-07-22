/**
 * Jobs API Service
 *
 * Handles all API calls related to jobs (projects)
 * Uses the configured axios instance with authentication
 */

import apiClient from "./index";

/**
 * Job client interface
 */
export interface JobClient {
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    location: string;
    memberSince: string;
    verified: boolean;
}

/**
 * Job interface matching backend response
 */
export interface Job {
    id: string;
    title: string;
    description: string;
    image: string;
    sellerAvatar: string; // For backward compatibility
    sellerName: string; // For backward compatibility
    rating: number; // Client rating
    ratingCount: number; // Client review count
    category: string;
    price: number; // Budget
    duration: string;
    skills: string[];
    experienceLevel: "Entry" | "Intermediate" | "Expert";
    // projectType: 'Fixed Price' | 'Hourly';
    proposals: number;
    postedDate: string;
    client: JobClient;
    attachments?: string[];
}

/**
 * Pagination info interface
 */
export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

/**
 * Jobs response interface
 */
export interface JobsResponse {
    success: boolean;
    data: {
        jobs: Job[];
        pagination: PaginationInfo;
    };
}

/**
 * Single job response interface
 */
export interface JobResponse {
    success: boolean;
    data: Job;
}

/**
 * Query parameters for fetching jobs
 */
export interface JobQueryParams {
    category?: string;
    search?: string;
    status?: "open" | "in_progress" | "completed" | "cancelled";
    minBudget?: number;
    maxBudget?: number;
    page?: number;
    limit?: number;
}

/**
 * Job creation data interface
 */
export interface CreateJobData {
    title: string;
    description: string;
    category: string;
    budget_min: number;
    budget_max: number;
    budget: number;
    duration: string;
    skills: string[];
    // projectType: 'Fixed Price' | 'Hourly';
    experienceLevel: "Entry" | "Intermediate" | "Expert";
    status?: string;
    visibility?: string;
}

/**
 * Create job response interface
 */
export interface CreateJobResponse {
    success: boolean;
    message: string;
    data: Job;
}

/**
 * Category interface
 */
export interface Category {
    _id: string;
    name: string;
    description?: string;
}

/**
 * Categories response interface
 */
export interface CategoriesResponse {
    success: boolean;
    data: Category[];
}

/**
 * Jobs API endpoints
 */
export const jobsApi = {
    /**
     * Get all jobs with optional filtering
     * @param params Query parameters for filtering and pagination
     * @returns Promise with jobs data and pagination info
     */
    getJobs: async (params?: JobQueryParams): Promise<JobsResponse> => {
        const queryParams = new URLSearchParams();

        // Add query parameters if provided
        if (params) {
            if (params.category) queryParams.append("category", params.category);
            if (params.search) queryParams.append("search", params.search);
            if (params.status) queryParams.append("status", params.status);
            if (params.minBudget !== undefined) queryParams.append("minBudget", params.minBudget.toString());
            if (params.maxBudget !== undefined) queryParams.append("maxBudget", params.maxBudget.toString());
            if (params.page) queryParams.append("page", params.page.toString());
            if (params.limit) queryParams.append("limit", params.limit.toString());
        }

        const queryString = queryParams.toString();
        const url = `/jobs${queryString ? `?${queryString}` : ""}`;

        const response = await apiClient.get<JobsResponse>(url);
        return response.data;
    },

    /**
     * Get single job by ID
     * @param id Job ID
     * @returns Promise with job data
     */
    getJobById: async (id: string): Promise<JobResponse> => {
        const response = await apiClient.get<JobResponse>(`/jobs/${id}`);
        return response.data;
    },

    /**
     * Create a new job
     * @param jobData Job creation data
     * @returns Promise with created job data
     */
    createJob: async (jobData: CreateJobData): Promise<CreateJobResponse> => {
        const response = await apiClient.post<CreateJobResponse>("/jobs", jobData);
        return response.data;
    },

    /**
     * Get all categories
     * @returns Promise with categories data
     */
    getCategories: async (): Promise<CategoriesResponse> => {
        const response = await apiClient.get<CategoriesResponse>("/jobs/categories");
        return response.data;
    },

    /**
     * Get current user's jobs (for clients)
     * @returns Promise with user's jobs
     */
    getMyJobs: async (): Promise<JobsResponse> => {
        const response = await apiClient.get<JobsResponse>("/jobs/my/jobs");
        return response.data;
    },
};
