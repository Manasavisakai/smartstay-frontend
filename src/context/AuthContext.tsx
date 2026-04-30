"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "../lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  adminRole?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
      checkProtectedRoutes(null);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const userData = await getCurrentUser(authToken);
      setUser(userData);
      checkProtectedRoutes(userData);
    } catch (err) {
      console.warn("Session expired or invalid token - logging out");
      logout();
    } finally {
      setLoading(false);
    }
  };

  const checkProtectedRoutes = (currentUser: User | null) => {
    const publicRoutes = ["/login", "/signup"];
    if (!currentUser && !publicRoutes.includes(pathname)) {
      router.push("/login");
    } else if (currentUser && publicRoutes.includes(pathname)) {
      router.push("/");
    }
  };

  const login = async (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    await fetchUser(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
