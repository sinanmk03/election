import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loading from "../components/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    // Optionally, show a loading spinner or some placeholder
    return <Loading />;
  }

  if (!user) {
    // If no user, redirect to login
    return <Navigate to="/login" />;
  }

  // Otherwise, render children
  return <>{children}</>;
}
