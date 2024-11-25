import { BrowserRouter, Routes, Route } from "react-router-dom";
import MembersList from "./components/MembersList";
import PageNotFound from "./components/PageNotFound";
import MembersStats from "./components/MembersStats";
import Login from "./components/Login";
import styles from "./app.module.css";
import MemberPage from "./components/FilterMembersPage/MemberPage";
import { MembersProvider } from "./components/FilterMembersPage/MembersContext.jsx";
function App() {
  return (
    <MembersProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MembersList />} />
          <Route path="/statistics" element={<MembersStats />}></Route>
          <Route path="/members/:memberId" element={<MemberPage />} />
          <Route path="/login" element={<Login />}></Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </MembersProvider>
  );
}

export default App;
