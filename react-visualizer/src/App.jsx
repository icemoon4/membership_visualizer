import { BrowserRouter, Routes, Route } from "react-router-dom";
import MembersList from "./components/MembersList";
import PageNotFound from "./components/PageNotFound";
import MembersStats from "./components/MembersStats";
import Login from "./components/Login";
import styles from "./app.module.css";
import Nav from "./components/Nav";
import MemberPage from "./components/MemberPage";
import { MembersProvider } from "./components/MembersContext.jsx";
function App() {
  //add a check for login state that returns only the login page here
  return (
    <MembersProvider>
      <BrowserRouter>
        <Nav />
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
