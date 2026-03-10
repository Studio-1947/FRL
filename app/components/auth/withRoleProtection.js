"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export function withRoleProtection(WrappedComponent, allowedRoles = []) {
  return function ProtectedRoute(props) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      if (isLoading) return;

      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }

      if (user) {
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          router.replace("/"); // Redirect to home or 403 page
          return;
        }
        setIsAuthorized(true);
      }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading || !isAuthorized) {
      return (
        <div className="w-full min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-primary animate-spin"></div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
