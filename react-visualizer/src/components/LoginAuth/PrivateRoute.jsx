import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, isValid, token }) => {
  if (!token || !isValid) {
    if (!token) {
      console.log("no token found");
    }
    if (!isValid) {
      console.log("invalid token");
    }
    return <Navigate to="/login" />;
  }
  return children;
};

export default PrivateRoute;
