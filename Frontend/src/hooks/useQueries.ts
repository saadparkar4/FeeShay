import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getProposals,
    getProposalById,
    createProposal,
    updateProposal,
    deleteProposal,
    getChats,
    getMessages,
    sendMessage,
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    getProfile,
    updateProfile,
    healthCheck,
    getCategories,
} from "../api/index";
import { signin, signup, me } from "../api/auth";

// ============================================================================
// JOB QUERIES
// ============================================================================
export const useJobs = (params?: any) => {
    return useQuery({
        queryKey: ["jobs", params],
        queryFn: () => getJobs(),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useJob = (id: string) => {
    return useQuery({
        queryKey: ["job", id],
        queryFn: () => getJobById(id),
        enabled: !!id,
    });
};

export const useCreateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (jobData: any) => createJob(jobData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
        },
    });
};

export const useUpdateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, jobData }: { id: string; jobData: any }) => updateJob(id, jobData),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            queryClient.invalidateQueries({ queryKey: ["job", id] });
        },
    });
};

export const useDeleteJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteJob(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
        },
    });
};

// ============================================================================
// SERVICE QUERIES
// ============================================================================
export const useServices = (params?: any) => {
    return useQuery({
        queryKey: ["services", params],
        queryFn: () => getServices(),
        staleTime: 2 * 60 * 1000,
    });
};

export const useService = (id: string) => {
    return useQuery({
        queryKey: ["service", id],
        queryFn: () => getServiceById(id),
        enabled: !!id,
    });
};

export const useCreateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (serviceData: any) => createService(serviceData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, serviceData }: { id: string; serviceData: any }) => updateService(id, serviceData),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
            queryClient.invalidateQueries({ queryKey: ["service", id] });
        },
    });
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });
};

// ============================================================================
// PROPOSAL QUERIES
// ============================================================================
export const useProposals = (params?: any) => {
    return useQuery({
        queryKey: ["proposals", params],
        queryFn: () => getProposals(),
        staleTime: 2 * 60 * 1000,
    });
};

export const useProposal = (id: string) => {
    return useQuery({
        queryKey: ["proposal", id],
        queryFn: () => getProposalById(id),
        enabled: !!id,
    });
};

export const useCreateProposal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (proposalData: any) => createProposal(proposalData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["proposals"] });
        },
    });
};

export const useUpdateProposal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, proposalData }: { id: string; proposalData: any }) => updateProposal(id, proposalData),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["proposals"] });
            queryClient.invalidateQueries({ queryKey: ["proposal", id] });
        },
    });
};

export const useDeleteProposal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteProposal(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["proposals"] });
        },
    });
};

// ============================================================================
// MESSAGE QUERIES
// ============================================================================
export const useChats = () => {
    return useQuery({
        queryKey: ["chats"],
        queryFn: () => getChats(),
        staleTime: 1 * 60 * 1000, // 1 minute for messages
    });
};

export const useMessages = (chatId: string) => {
    return useQuery({
        queryKey: ["messages", chatId],
        queryFn: () => getMessages(chatId),
        enabled: !!chatId,
        staleTime: 30 * 1000, // 30 seconds for messages
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ chatId, messageData }: { chatId: string; messageData: any }) => sendMessage(chatId, messageData),
        onSuccess: (_, { chatId }) => {
            queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
    });
};

// ============================================================================
// REVIEW QUERIES
// ============================================================================
export const useReviews = (params?: any) => {
    return useQuery({
        queryKey: ["reviews", params],
        queryFn: () => getReviews(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewData: any) => createReview(reviewData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
        },
    });
};

export const useUpdateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reviewData }: { id: string; reviewData: any }) => updateReview(id, reviewData),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
        },
    });
};

export const useDeleteReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteReview(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
        },
    });
};

// ============================================================================
// AUTH QUERIES
// ============================================================================
export const useProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: () => getProfile(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (profileData: any) => updateProfile(profileData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};

export const useLogin = () => {
    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) => signin(email, password),
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: ({ email, password, name, role }: { email: string; password: string; name: string; role: "freelancer" | "client" }) => signup(email, password, name, role),
    });
};

export const useMe = () => {
    return useQuery({
        queryKey: ["me"],
        queryFn: () => me(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// ============================================================================
// HEALTH CHECK
// ============================================================================
export const useHealthCheck = () => {
    return useQuery({
        queryKey: ["health"],
        queryFn: () => healthCheck(),
        staleTime: 1 * 60 * 1000, // 1 minute
    });
};

// CATEGORY QUERIES
// ============================================================================
export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
        staleTime: 2 * 60 * 1000,
    });
};
