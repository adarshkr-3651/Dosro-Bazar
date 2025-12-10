"use client";

import React, { useState, useEffect, ReactNode, createContext } from "react";
import axios, { AxiosRequestConfig } from "axios";

console.log("AuthContext module loaded");

// --- Types ---
interface User {
  email?: string;
  [key: string]: any;
}

interface AuthContextType {
  activeUser: User | null;
  setActiveUser: React.Dispatch<React.SetStateAction<User | null>>;
  config: AxiosRequestConfig;
  setConfig: React.Dispatch<React.SetStateAction<AxiosRequestConfig>>;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

// --- Create Context ---
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- AuthContext Provider ---
const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [config, setConfig] = useState<AxiosRequestConfig>({
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("authToken") : ""}`,
    },
  });

  // Check authentication on mount
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) return;

    const checkAuth = async () => {
      try {
        const { data } = await axios.get("/auth/private", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setActiveUser(data.user);
      } catch (error: any) {
        console.log("[AuthContext] Auth failed:", error.response?.data?.error);
        localStorage.removeItem("authToken");
        setActiveUser(null);
      }
    };

    checkAuth();
  }, []);

  // --- Login ---
  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    setConfig({
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // --- Logout ---
  const logout = () => {
    localStorage.removeItem("authToken");
    setActiveUser(null);
    setConfig({
      headers: {
        "Content-Type": "application/json",
        Authorization: "",
      },
    });
  };

  return (
    <AuthContext.Provider value={{ activeUser, setActiveUser, config, setConfig, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
