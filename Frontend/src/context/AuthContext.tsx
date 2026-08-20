import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/auth";

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: any) => Promise<any>;
  register: (data: any) => Promise<any>;
  verifyOtp: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  setSession: (token: string, user: User) => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const initAuth = () => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    initAuth();

    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener("auth-expired", handleAuthExpired);
    return () => {
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, []);

  const login = async (data: any) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      if (res.success && res.data) {
        const { user: loggedUser, accessToken } = res.data;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        setToken(accessToken);
        setUser(loggedUser);
        return res;
      }
      throw new Error(res.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    return await authApi.register(data);
  };

  const verifyOtp = async (data: any) => {
    const res = await authApi.verifyEmail(data);
    if (res.success && res.data) {
      const { user: loggedUser, token: accessToken } = res.data;
      if (accessToken) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        setToken(accessToken);
        setUser(loggedUser);
      }
    }
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error("Logout request failed:", e);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  };

  const setSession = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const isAdmin = user?.role === "ADMIN";
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        verifyOtp,
        logout,
        setSession,
        isAdmin,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
