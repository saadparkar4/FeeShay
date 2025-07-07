import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLogin, useRegister, useLogout } from "../hooks/useQueries";

// User interface
export interface User {
    _id: string;
    email: string;
    role: "freelancer" | "client";
    name?: string;
    created_at: string;
    last_login?: string;
    dark_mode: boolean;
    is_active: boolean;
}

// Auth context interface
interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, role: "freelancer" | "client") => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
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
    const [isLoading, setIsLoading] = useState(true);

    const loginMutation = useLogin();
    const registerMutation = useRegister();
    const logoutMutation = useLogout();

    // Check for stored token on app start
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                const userData = await AsyncStorage.getItem("userData");

                if (token && userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error("Error checking auth status:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await loginMutation.mutateAsync({ email, password });

            if (response.success && response.data) {
                const { token, user: userData } = response.data as { token: string; user: User };

                // Store token and user data
                await AsyncStorage.setItem("authToken", token);
                await AsyncStorage.setItem("userData", JSON.stringify(userData));

                setUser(userData);
            } else {
                throw new Error(response.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (email: string, password: string, role: "freelancer" | "client") => {
        try {
            const response = await registerMutation.mutateAsync({ email, password, role });

            if (response.success && response.data) {
                const { token, user: userData } = response.data as { token: string; user: User };

                // Store token and user data
                await AsyncStorage.setItem("authToken", token);
                await AsyncStorage.setItem("userData", JSON.stringify(userData));

                setUser(userData);
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
            await logoutMutation.mutateAsync();

            // Clear stored data
            await AsyncStorage.removeItem("authToken");
            await AsyncStorage.removeItem("userData");

            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
            // Even if the API call fails, clear local data
            await AsyncStorage.removeItem("authToken");
            await AsyncStorage.removeItem("userData");
            setUser(null);
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
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
