import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../api/client";

interface User {
    id: string;
    email: string;
    role: "freelancer" | "client";
    created_at: string;
    last_login?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, role: "freelancer" | "client", name: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on app start
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const storedToken = await AsyncStorage.getItem("authToken");
            const storedUser = await AsyncStorage.getItem("user");

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Error checking auth status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token: newToken, user: userData } = response.data.data;

            await AsyncStorage.setItem("authToken", newToken);
            await AsyncStorage.setItem("user", JSON.stringify(userData));

            setToken(newToken);
            setUser(userData);
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (email: string, password: string, role: "freelancer" | "client", name: string) => {
        try {
            const response = await authAPI.register({ email, password, role, name });
            const { token: newToken, user: userData } = response.data.data;

            await AsyncStorage.setItem("authToken", newToken);
            await AsyncStorage.setItem("user", JSON.stringify(userData));

            setToken(newToken);
            setUser(userData);
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("authToken");
            await AsyncStorage.removeItem("user");
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const updateProfile = async (data: any) => {
        try {
            const response = await authAPI.updateProfile(data);
            const updatedUser = response.data.data.user;

            await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (error) {
            console.error("Profile update error:", error);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
