/**
 * React Query Hooks for Talents
 * 
 * Custom hooks for fetching and managing talent data
 * Uses TanStack Query for caching and state management
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { talentsApi, TalentsResponse, TalentResponse, CategoriesResponse, TalentQueryParams } from '@/api/talents';

/**
 * Query key factory for talents
 * Ensures consistent query keys across the application
 */
export const talentKeys = {
  all: ['talents'] as const,
  lists: () => [...talentKeys.all, 'list'] as const,
  list: (params?: TalentQueryParams) => [...talentKeys.lists(), params] as const,
  details: () => [...talentKeys.all, 'detail'] as const,
  detail: (id: string) => [...talentKeys.details(), id] as const,
  categories: () => ['talent-categories'] as const,
};

/**
 * Hook to fetch talents with filtering and pagination
 * 
 * @param params Query parameters for filtering
 * @returns Query result with talents data
 * 
 * @example
 * const { data, isLoading, error } = useTalents({ category: 'Web Development', page: 1 });
 */
export function useTalents(params?: TalentQueryParams): UseQueryResult<TalentsResponse, Error> {
  return useQuery({
    queryKey: talentKeys.list(params),
    queryFn: () => talentsApi.getTalents(params),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (formerly cacheTime)
  });
}

/**
 * Hook to fetch a single talent by ID
 * 
 * @param id Talent ID
 * @param enabled Whether the query should run
 * @returns Query result with talent data
 * 
 * @example
 * const { data, isLoading, error } = useTalent('123');
 */
export function useTalent(
  id: string,
  enabled = true
): UseQueryResult<TalentResponse, Error> {
  return useQuery({
    queryKey: talentKeys.detail(id),
    queryFn: () => talentsApi.getTalentById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch talent categories
 * 
 * @returns Query result with categories data
 * 
 * @example
 * const { data, isLoading, error } = useTalentCategories();
 */
export function useTalentCategories(): UseQueryResult<CategoriesResponse, Error> {
  return useQuery({
    queryKey: talentKeys.categories(),
    queryFn: () => talentsApi.getCategories(),
    staleTime: 30 * 60 * 1000, // Categories don't change often, cache for 30 minutes
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
  });
}