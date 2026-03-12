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
    // With HttpOnly cookies, we can't reliably check document.cookie.
    // Instead, we'll rely on the initial fetchUserProfile call to set state.
    // However, if we need a synchronous check before the fetch, we could use
    // a non-HttpOnly "session_exists" cookie set by the backend.
    // For now, we'll just check if we have user data.
    if (user) {
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    // We'll perform an initial auth check by trying to fetch the profile.
    // This replaces the document.cookie check.
    fetchUserProfile();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { fetchApi } = await import("@/lib/api");
      const response = await fetchApi("/v1/users/profile");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUser(null);
    }
  };

  const login = (userData) => {
    // Token is now set in HttpOnly cookie by backend.
    // We just need to update the local state with user info if provided,
    // or trigger a profile fetch.
    if (userData) {
      setUser(userData);
    } else {
      fetchUserProfile();
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      const { fetchApi } = await import("@/lib/api");
      await fetchApi("/v1/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      // Backend clears the HttpOnly cookies.
      setUser(null);
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
