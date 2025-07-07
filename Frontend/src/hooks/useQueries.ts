import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { JobService, ServiceService, CategoryService, ProposalService, ReviewService, AuthService } from "../api/client";

// ============================================================================
// JOB QUERIES
// ============================================================================
export const useJobs = (params?: any) => {
    return useQuery({
        queryKey: ["jobs", params],
        queryFn: () => JobService.getJobs(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useJob = (id: string) => {
    return useQuery({
        queryKey: ["job", id],
        queryFn: () => JobService.getJob(id),
        enabled: !!id,
    });
};

export const useMyJobs = (params?: any) => {
    return useQuery({
        queryKey: ["my-jobs", params],
        queryFn: () => JobService.getMyJobs(params),
        staleTime: 2 * 60 * 1000,
    });
};

export const useCreateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (jobData: any) => JobService.createJob(jobData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
        },
    });
};

export const useUpdateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, jobData }: { id: string; jobData: any }) => JobService.updateJob(id, jobData),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
            queryClient.invalidateQueries({ queryKey: ["job", id] });
        },
    });
};

export const useDeleteJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => JobService.deleteJob(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
        },
    });
};

// ============================================================================
// SERVICE QUERIES
// ============================================================================
export const useServices = (params?: any) => {
    return useQuery({
        queryKey: ["services", params],
        queryFn: () => ServiceService.getServices(params),
        staleTime: 2 * 60 * 1000,
    });
};

export const useService = (id: string) => {
    return useQuery({
        queryKey: ["service", id],
        queryFn: () => ServiceService.getService(id),
        enabled: !!id,
    });
};

export const useMyServices = (params?: any) => {
    return useQuery({
        queryKey: ["my-services", params],
        queryFn: () => ServiceService.getMyServices(params),
        staleTime: 2 * 60 * 1000,
    });
};

export const useCreateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (serviceData: any) => ServiceService.createService(serviceData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
            queryClient.invalidateQueries({ queryKey: ["my-services"] });
        },
    });
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, serviceData }: { id: string; serviceData: any }) => ServiceService.updateService(id, serviceData),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
            queryClient.invalidateQueries({ queryKey: ["my-services"] });
            queryClient.invalidateQueries({ queryKey: ["service", id] });
        },
    });
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ServiceService.deleteService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
            queryClient.invalidateQueries({ queryKey: ["my-services"] });
        },
    });
};

// ============================================================================
// CATEGORY QUERIES
// ============================================================================
export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => CategoryService.getCategories(),
        staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
    });
};

// ============================================================================
// PROPOSAL QUERIES
// ============================================================================
export const useProposals = (params?: any) => {
    return useQuery({
        queryKey: ["proposals", params],
        queryFn: () => ProposalService.getProposals(params),
        staleTime: 2 * 60 * 1000,
    });
};

export const useProposal = (id: string) => {
    return useQuery({
        queryKey: ["proposal", id],
        queryFn: () => ProposalService.getProposal(id),
        enabled: !!id,
    });
};

export const useMyProposals = (params?: any) => {
    return useQuery({
        queryKey: ["my-proposals", params],
        queryFn: () => ProposalService.getMyProposals(params),
        staleTime: 2 * 60 * 1000,
    });
};

export const useCreateProposal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (proposalData: any) => ProposalService.createProposal(proposalData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["proposals"] });
            queryClient.invalidateQueries({ queryKey: ["my-proposals"] });
        },
    });
};

export const useUpdateProposal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, proposalData }: { id: string; proposalData: any }) => ProposalService.updateProposal(id, proposalData),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["proposals"] });
            queryClient.invalidateQueries({ queryKey: ["my-proposals"] });
            queryClient.invalidateQueries({ queryKey: ["proposal", id] });
        },
    });
};

export const useDeleteProposal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ProposalService.deleteProposal(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["proposals"] });
            queryClient.invalidateQueries({ queryKey: ["my-proposals"] });
        },
    });
};

// ============================================================================
// REVIEW QUERIES
// ============================================================================
export const useReviews = (params?: any) => {
    return useQuery({
        queryKey: ["reviews", params],
        queryFn: () => ReviewService.getReviews(params),
        staleTime: 5 * 60 * 1000,
    });
};

export const useReview = (id: string) => {
    return useQuery({
        queryKey: ["review", id],
        queryFn: () => ReviewService.getReviewById(id),
        enabled: !!id,
    });
};

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewData: any) => ReviewService.createReview(reviewData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
        },
    });
};

export const useUpdateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reviewData }: { id: string; reviewData: any }) => ReviewService.updateReview(id, reviewData),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            queryClient.invalidateQueries({ queryKey: ["review", id] });
        },
    });
};

export const useDeleteReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ReviewService.deleteReview(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
        },
    });
};

// ============================================================================
// PROFILE QUERIES
// ============================================================================
export const useProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: () => AuthService.getProfile(),
        staleTime: 5 * 60 * 1000,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (profileData: any) => AuthService.updateProfile(profileData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};

// ============================================================================
// AUTH MUTATIONS
// ============================================================================
export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: { email: string; password: string }) => AuthService.login(credentials.email, credentials.password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userData: { email: string; password: string; role: "freelancer" | "client" }) => AuthService.register(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => AuthService.logout(),
        onSuccess: () => {
            // Clear all queries on logout
            queryClient.clear();
        },
    });
};
