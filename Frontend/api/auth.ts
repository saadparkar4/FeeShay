import apiClient from "./index";
import { storeToken, deleteToken } from "./storage";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  role: "client" | "freelancer" | "both";
  name: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      role: string;
      created_at?: string;
      last_login?: string;
    };
  };
}

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      console.log("Login request data:", data);
      const response = await apiClient.post<AuthResponse>("/auth/login", data);
      console.log("Login response:", response.data);
      
      if (response.data.data.token) {
        await storeToken(response.data.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      console.error("Login error details:", error.response?.data || error.message);
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      console.log("Register request data:", data);
      const response = await apiClient.post<AuthResponse>("/auth/register", data);
      console.log("Register response:", response.data);
      
      if (response.data.data.token) {
        await storeToken(response.data.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      console.error("Register error details:", error.response?.data || error.message);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await deleteToken();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get("/auth/profile");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  updateProfile: async (data: any) => {
    try {
      const response = await apiClient.put("/auth/profile", data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await apiClient.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await apiClient.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};