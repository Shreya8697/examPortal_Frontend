import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // agar user login nahi hai to redirect to home (/)
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
