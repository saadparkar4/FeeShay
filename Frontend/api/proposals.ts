import apiClient from './index';

export interface Proposal {
  _id: string;
  job: {
    _id: string;
    title: string;
    description: string;
    budget_min: number;
    budget_max: number;
    status: string;
  };
  freelancer: {
    _id: string;
    name: string;
    location: string;
    skills: string[];
    bio?: string;
  };
  cover_letter: string;
  proposed_price: number;
  status: 'active' | 'completed' | 'cancelled' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface CreateProposalData {
  job: string;
  cover_letter: string;
  proposed_price: number;
}

export interface ProposalResponse {
  success: boolean;
  message?: string;
  data?: Proposal | {
    proposals: Proposal[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

const proposalApi = {
  // Create new proposal (freelancer)
  createProposal: async (data: CreateProposalData): Promise<ProposalResponse> => {
    const response = await apiClient.post('/proposals', data);
    return response.data;
  },

  // Get all proposals with filters
  getProposals: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    job?: string;
    freelancer?: string;
  }): Promise<ProposalResponse> => {
    const response = await apiClient.get('/proposals', { params });
    return response.data;
  },

  // Get proposal by ID
  getProposalById: async (id: string): Promise<ProposalResponse> => {
    const response = await apiClient.get(`/proposals/${id}`);
    return response.data;
  },

  // Update proposal (freelancer)
  updateProposal: async (id: string, data: Partial<CreateProposalData>): Promise<ProposalResponse> => {
    const response = await apiClient.put(`/proposals/${id}`, data);
    return response.data;
  },

  // Delete proposal (freelancer)
  deleteProposal: async (id: string): Promise<ProposalResponse> => {
    const response = await apiClient.delete(`/proposals/${id}`);
    return response.data;
  },

  // Get my proposals (freelancer)
  getMyProposals: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ProposalResponse> => {
    const response = await apiClient.get('/proposals/my/proposals', { params });
    return response.data;
  },

  // Get proposals for a specific job (client)
  getJobProposals: async (jobId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ProposalResponse> => {
    const response = await apiClient.get(`/proposals/job/${jobId}`, { params });
    return response.data;
  },

  // Update proposal status (client - accept/reject)
  updateProposalStatus: async (id: string, status: 'completed' | 'rejected'): Promise<ProposalResponse> => {
    const response = await apiClient.put(`/proposals/${id}/status`, { status });
    return response.data;
  },
};

export default proposalApi;