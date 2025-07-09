import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { me, signin, signup } from "../api/auth";
import { deleteToken, getToken } from "../api/storage";

// Type definitions
export interface User {
    id: string;
    email: string;
    role: "freelancer" | "client";
    created_at: string;
    last_login?: string;
    dark_mode?: boolean;
    is_active: boolean;
}

export interface Profile {
    name: string;
    bio?: string;
    location?: string;
    languages?: string[];
    profile_image_url?: string;
    member_since?: string;
    client_since?: string;
    onboarding_complete?: boolean;
    skills?: string[];
}

export interface AuthData {
    user: User;
    profile: Profile;
}

// Auth context interface
interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string, role: "freelancer" | "client") => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    refreshProfile: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
    children: React.ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for stored token on app start
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = await getToken();
                if (token) {
                    // Try to get user profile
                    await refreshProfile();
                }
            } catch (error) {
                console.error("Error checking auth status:", error);
                // Clear invalid token
                await deleteToken();
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const refreshProfile = async () => {
        try {
            const response = await me();
            if (response.success && response.data) {
                const authData: AuthData = response.data;
                setUser(authData.user);
                setProfile(authData.profile);
            }
        } catch (error) {
            console.error("Error refreshing profile:", error);
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await signin(email, password);

            if (response.success && response.data) {
                const { token } = response.data;

                // Store token
                await AsyncStorage.setItem("authToken", token);

                // Get full profile
                await refreshProfile();
            } else {
                throw new Error(response.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (email: string, password: string, name: string, role: "freelancer" | "client") => {
        try {
            const response = await signup(email, password, name, role);

            if (response.success && response.data) {
                const { token } = response.data;

                // Store token
                await AsyncStorage.setItem("authToken", token);

                // Get full profile
                await refreshProfile();
            } else {
                throw new Error(response.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Clear stored data
            await deleteToken();
            await AsyncStorage.removeItem("authToken");

            setUser(null);
            setProfile(null);
        } catch (error) {
            console.error("Logout error:", error);
            // Even if the API call fails, clear local data
            await deleteToken();
            await AsyncStorage.removeItem("authToken");
            setUser(null);
            setProfile(null);
        }
    };

    const value: AuthContextType = {
        user,
        profile,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        refreshProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;
