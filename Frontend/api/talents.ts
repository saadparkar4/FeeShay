/**
 * Talents API Service
 * 
 * Handles all API calls related to talents (freelancers)
 * Uses the configured axios instance with authentication
 */

import apiClient from './index';

/**
 * Talent interface matching backend response
 */
export interface Talent {
  id: string;
  name: string;
  email: string;
  title: string;
  avatar: string;
  location: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  price: number; // hourly rate
  category: string;
  bio: string;
  responseTime: string;
  languages: string[];
  completedProjects: number;
  memberSince?: string;
}

/**
 * Category interface
 */
export interface Category {
  name: string;
  icon: string;
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
 * Talents response interface
 */
export interface TalentsResponse {
  success: boolean;
  data: {
    talents: Talent[];
    pagination: PaginationInfo;
  };
}

/**
 * Single talent response interface
 */
export interface TalentResponse {
  success: boolean;
  data: Talent;
}

/**
 * Categories response interface
 */
export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

/**
 * Query parameters for fetching talents
 */
export interface TalentQueryParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  skills?: string;
  page?: number;
  limit?: number;
}

/**
 * Talents API endpoints
 */
export const talentsApi = {
  /**
   * Get all talents with optional filtering
   * @param params Query parameters for filtering and pagination
   * @returns Promise with talents data and pagination info
   */
  getTalents: async (params?: TalentQueryParams): Promise<TalentsResponse> => {
    const queryParams = new URLSearchParams();
    
    // Add query parameters if provided
    if (params) {
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.skills) queryParams.append('skills', params.skills);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
    }
    
    const queryString = queryParams.toString();
    const url = `/api/v1/talents${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<TalentsResponse>(url);
    return response.data;
  },

  /**
   * Get single talent by ID
   * @param id Talent ID
   * @returns Promise with talent data
   */
  getTalentById: async (id: string): Promise<TalentResponse> => {
    const response = await apiClient.get<TalentResponse>(`/api/v1/talents/${id}`);
    return response.data;
  },

  /**
   * Get talent categories
   * @returns Promise with categories data
   */
  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await apiClient.get<CategoriesResponse>('/api/v1/talents/categories');
    return response.data;
  },
};