"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const checkAuth = () => {
    if (typeof document !== "undefined") {
      const tokenExists = document.cookie.includes("access_token");
      setIsAuthenticated(tokenExists);
    }
  };

  useEffect(() => {
    checkAuth();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    } else {
      setUser(null);
    }
  }, [isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      const { fetchApi } = await import("@/lib/api");
      const response = await fetchApi("/v1/users/profile");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const login = (token) => {
    document.cookie = `access_token=${token}; path=/; max-age=3153600000; SameSite=Lax`;
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      // Import fetchApi dynamically or move it to a hook to avoid circular refs if needed,
      // but here we can just use the global fetch or import it if safe.
      // Since fetchApi is in lib/api.js, let's import it.
      const { fetchApi } = await import("@/lib/api");
      await fetchApi("/v1/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setIsAuthenticated(false);
      setIsLoggingOut(false);
      toast.info("Logged out successfully");
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        isLoggingOut,
        user,
        login,
        logout,
        checkAuth,
        refreshUser: fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
