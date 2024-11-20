import FetchMemberList from "./FetchMemberList";
import Filter from "./Filter";
import Nav from "./Nav";
import { useState } from "react";

export default function MembersList() {
  const [MemberList, setMembersList] = useState([]);
  return (
    <div className="MembersList">
      <Nav />
      <FetchMemberList
        setMembersList={setMembersList}
        MemberList={MemberList}
      />
      <Filter MemberList={MemberList} />
    </div>
  );
}
