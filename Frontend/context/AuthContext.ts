import { createContext } from "react";

export type UserRole = "freelancer" | "client";

interface AuthContextType {
	isAuthenticated: boolean;
	setIsAuthenticated: (isAuthenticated: boolean) => void;
	userRole: UserRole;
	setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	setIsAuthenticated: () => {},
	userRole: "freelancer",
	setUserRole: () => {},
});

export default AuthContext;
