/**
 * React Query Hooks for Jobs
 * 
 * Custom hooks for fetching and managing job data
 * Uses TanStack Query for caching and state management
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { jobsApi, JobsResponse, JobResponse, JobQueryParams } from '@/api/jobs';

/**
 * Query key factory for jobs
 * Ensures consistent query keys across the application
 */
export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (params?: JobQueryParams) => [...jobKeys.lists(), params] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
};

/**
 * Hook to fetch jobs with filtering and pagination
 * 
 * @param params Query parameters for filtering
 * @returns Query result with jobs data
 * 
 * @example
 * const { data, isLoading, error } = useJobs({ category: 'Design', page: 1 });
 */
export function useJobs(params?: JobQueryParams): UseQueryResult<JobsResponse, Error> {
  return useQuery({
    queryKey: jobKeys.list(params),
    queryFn: () => jobsApi.getJobs(params),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}

/**
 * Hook to fetch a single job by ID
 * 
 * @param id Job ID
 * @param enabled Whether the query should run
 * @returns Query result with job data
 * 
 * @example
 * const { data, isLoading, error } = useJob('123');
 */
export function useJob(
  id: string,
  enabled = true
): UseQueryResult<JobResponse, Error> {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => jobsApi.getJobById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}