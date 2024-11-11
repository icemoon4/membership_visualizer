import { useState } from "react";
import FetchMemberList from "./components/FetchMemberList";
import Filter from "./components/Filter";
function App() {
  const [MemberList, setMembersList] = useState([]);
  return (
    <div className="App">
      <FetchMemberList
        setMembersList={setMembersList}
        MemberList={MemberList}
      />
      <Filter MemberList={MemberList} />
    </div>
  );
}

export default App;
