import stylesLogin from "./Login.module.css";
import styles from "../../App.module.css";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LogoHeader from "../Nav/LogoHeader";
import axios from 'redaxios';
import Cookies from 'js-cookie';


export default function Login({ onLoginSuccess, setAccessToken, setRefreshToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorDisplay, setError] = useState("");
  const navigate = useNavigate();
  const csrfToken = Cookies.get('csrftoken');
  //in the future: this url here: https://medium.com/@preciousimoniakemu/create-a-react-login-page-that-authenticates-with-django-auth-token-8de489d2f751
  //I think this should take the branch name as a parameter a put it in the header
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login/",
      {
        username,
        password,
      },
      {
        headers: {
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true, //so we can send cookies
      }
  );
      setError(null);
      setAccessToken(response.data.access);
      setRefreshToken(response.data.refresh);
      navigate("/app/search");
      onLoginSuccess();
      console.log("navigating");
    } catch (error) {
      console.error("Login failed:", error);
      const message =
        error?.data?.error ||
        error?.data?.detail ||
        error?.message ||
        error?.data ||
        "Login failed due to an unknown error.";
      //axios.defaults.headers.common["Authorization"] = null;
      setError(message);
      // Handle login error (e.g., show error message)
    }
  };
  return (
    <main className={stylesLogin.loginPage}>
      <form className={stylesLogin.loginContainer} onSubmit={handleLogin}>
        <div
          className={stylesLogin.error}
          style={{ display: errorDisplay ? "block" : "none" }}
        >
          Error: {errorDisplay + "."}
        </div>
        <LogoHeader />
        <label htmlFor="username">Username: </label>
        <input
          htmlFor="username"
          type="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password: </label>
        <input
          htmlFor="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.redButton}>Log in</button>
      </form>
    </main>
  );
}
