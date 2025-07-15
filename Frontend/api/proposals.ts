import axios from 'axios';
import { API_BASE_URL } from './config';

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
    const response = await axios.post(`${API_BASE_URL}/proposals`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
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
    const response = await axios.get(`${API_BASE_URL}/proposals`, {
      params,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Get proposal by ID
  getProposalById: async (id: string): Promise<ProposalResponse> => {
    const response = await axios.get(`${API_BASE_URL}/proposals/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Update proposal (freelancer)
  updateProposal: async (id: string, data: Partial<CreateProposalData>): Promise<ProposalResponse> => {
    const response = await axios.put(`${API_BASE_URL}/proposals/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Delete proposal (freelancer)
  deleteProposal: async (id: string): Promise<ProposalResponse> => {
    const response = await axios.delete(`${API_BASE_URL}/proposals/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Get my proposals (freelancer)
  getMyProposals: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ProposalResponse> => {
    const response = await axios.get(`${API_BASE_URL}/proposals/my/proposals`, {
      params,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Get proposals for a specific job (client)
  getJobProposals: async (jobId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ProposalResponse> => {
    const response = await axios.get(`${API_BASE_URL}/proposals/job/${jobId}`, {
      params,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Update proposal status (client - accept/reject)
  updateProposalStatus: async (id: string, status: 'completed' | 'rejected'): Promise<ProposalResponse> => {
    const response = await axios.put(`${API_BASE_URL}/proposals/${id}/status`, {
      status,
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
};

export default proposalApi;