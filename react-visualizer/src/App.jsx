import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import MembersList from "./components/MemberDisplay/MembersList";
import PageNotFound from "./components/PageNotFound";
import MembersStats from "./components/Stats/MembersStats";
import Login from "./components/LoginAuth/Login";
import styles from "./app.module.css";
import Nav from "./components/Nav/Nav";
import Logout from "./components/LoginAuth/Logout";
import MemberPage from "./components/MemberDisplay/MemberPage";
import { MembersProvider } from "./components/MembersContext.jsx";
import { validateToken } from "./components/LoginAuth/validateToken";
import PrivateRoute from "./components/LoginAuth/PrivateRoute";

function App() {
  //add a check for login state that returns only the login page here
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for validation
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const isValid = await validateToken(token);
        setIsAuthenticated(isValid);
        if (!isValid) localStorage.removeItem("token"); //clear the invalid token
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
      //console.log("is_auth:", isAuthenticated);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  return (
    <BrowserRouter>
      {isAuthenticated ? (
        <>
          <Nav />
          <MembersProvider>
            <Routes>
              <Route
                path="/app/search"
                element={
                  <PrivateRoute isValid={isAuthenticated}>
                    <MembersList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/app/statistics"
                element={
                  <PrivateRoute isValid={isAuthenticated}>
                    <MembersStats />
                  </PrivateRoute>
                }
              />
              <Route
                path="/app/members/:memberId"
                element={
                  <PrivateRoute isValid={isAuthenticated}>
                    <MemberPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/app/logout"
                element={
                  <PrivateRoute isValid={isAuthenticated}>
                    <Logout onLogoutSuccess={() => setIsAuthenticated(false)} />
                  </PrivateRoute>
                }
              />
              <Route
                path="*"
                element={
                  <PrivateRoute isValid={isAuthenticated}>
                    <PageNotFound />
                  </PrivateRoute>
                }
              />
            </Routes>
          </MembersProvider>
        </>
      ) : (
        <Routes>
          <Route
            path="/app/login"
            element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />}
          />
          <Route path="*" element={<Navigate to="/app/login" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
