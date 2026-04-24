import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuth = sessionStorage.getItem("soi_admin_auth") === "true";
  if (!isAuth) return <Navigate to="/admin" replace />;
  return children;
}
