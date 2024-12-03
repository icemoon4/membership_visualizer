import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, isValid }) => {
  const token = localStorage.getItem("token");
  if (!token || !isValid) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default PrivateRoute;
