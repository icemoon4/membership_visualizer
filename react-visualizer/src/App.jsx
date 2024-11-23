import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MembersList from "./components/MembersList";
import PageNotFound from "./components/PageNotFound";
import MembersStats from "./components/MembersStats";
import Login from "./components/Login";
import styles from "./app.module.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MembersList />} />
        <Route path="/statistics" element={<MembersStats />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
