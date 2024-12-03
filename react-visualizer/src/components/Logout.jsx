import { Navigate } from "react-router-dom";

export default function Logout() {
  localStorage.removeItem("token");
  console.log(localStorage.getItem("token"));
  return <Login />;
}
