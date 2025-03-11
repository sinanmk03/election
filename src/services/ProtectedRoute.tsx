import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loading from "../components/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, initialized } = useAuth();

  // Wait until we've finished reading localStorage
  if (!initialized) {
    return <Loading />;
  }

  // If no user is present, redirect to /login
  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
