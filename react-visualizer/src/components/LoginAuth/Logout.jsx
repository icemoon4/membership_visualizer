import { Navigate } from "react-router-dom";
import Login from "./Login.jsx";

export default function Logout({ onLogoutSuccess }) {
  onLogoutSuccess();
  return <Login />;
}
