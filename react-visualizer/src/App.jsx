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
import axios from 'redaxios';

function App() {
  //add a check for login state that returns only the login page here
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [loading, setLoading] = useState(true); // Loading state for validation
  useEffect(() => {
    const checkAuth = async () => {
      let token = accessToken;
      if (!token) { //new session? check for refresh cookie
        try {
          const response = await axios.post("api/validate-refresh-token/", {}, { withCredentials: true });
          token = response.data.access;
          setAccessToken(token);
        }
        catch (err) {
          console.log("Token refresh failed:", err.response?.data || err.message);
        }
      }
      //did we get a token? let's validate it
      if (token) {
        const isValid = await validateToken(token, refreshToken, setRefreshToken, setAccessToken);
        setIsAuthenticated(isValid);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
      //console.log("is_auth:", isAuthenticated);
    };
    checkAuth();
  }, []);

const FIVE_MINUTES = 1000 * 60 * 5;

const handleOnIdle = () => {
  setAccessToken(null);
  setRefreshToken(null);
  setIsAuthenticated(false);
};

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  return (
    <BrowserRouter>
      {isAuthenticated && <Nav />}
        <Routes>
              <Route path="/" element={<Navigate to="/app/search" replace />} />
              <Route
                path="/app/search"
                element={
                  <PrivateRoute isValid={isAuthenticated} token={accessToken}>
                    <IdleTimerProvider timeout={FIVE_MINUTES} onIdle={handleOnIdle}>
                      <MembersProvider>
                        <MembersList />
                      </MembersProvider>
                    </IdleTimerProvider>
                  </PrivateRoute>
                }
              />
              <Route
                path="/app/statistics"
                element={
                  <PrivateRoute isValid={isAuthenticated} token={accessToken}>
                    <IdleTimerProvider timeout={FIVE_MINUTES} onIdle={handleOnIdle}>
                      <MembersProvider>
                        <MembersStats />
                      </MembersProvider>
                    </IdleTimerProvider>
                  </PrivateRoute>
                }
              />
              <Route
                path="/app/members/:memberId"
                element={
                  <PrivateRoute isValid={isAuthenticated} token={accessToken}>
                    <IdleTimerProvider timeout={FIVE_MINUTES} onIdle={handleOnIdle}>
                      <MembersProvider>
                        <MemberPage />
                      </MembersProvider>
                    </IdleTimerProvider>
                  </PrivateRoute>
                }
              />
            <Route
              path="/app/logout"
              element={
                <PrivateRoute isValid={isAuthenticated} token={accessToken}>
                  <Logout onLogoutSuccess={() => setIsAuthenticated(false)} />
                </PrivateRoute>
              }
            />
          <Route
            path="/app/login"
            element={<Login onLoginSuccess={() => setIsAuthenticated(true)} setAccessToken={setAccessToken} setRefreshToken={setRefreshToken}/>}
          />
          <Route
                path="*"
                  element={isAuthenticated ? (<PageNotFound />) : (<Navigate to="/app/login" replace />)}
              />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
