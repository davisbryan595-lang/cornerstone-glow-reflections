import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sessionUser, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!sessionUser) return <Navigate to={`/auth?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  return <>{children}</>;
};

export const RequireMember: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sessionUser, isMember, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!sessionUser) return <Navigate to={`/auth?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  if (!isMember) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center">
        <h1 className="text-3xl font-montserrat font-bold mb-3">Members only</h1>
        <p className="text-muted-foreground mb-6 font-inter">Become a member to access your personalized dashboard and customizations.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => (window.location.href = "/subscription")}>Become a member</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/membership")}>Learn more</Button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sessionUser, isAdmin, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!sessionUser) return <Navigate to={`/auth?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  if (!isAdmin) return <Navigate to={"/"} state={{ from: location }} replace />;
  return <>{children}</>;
};
