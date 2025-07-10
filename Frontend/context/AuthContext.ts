import { createContext } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: boolean) => {},
});

export default AuthContext;
