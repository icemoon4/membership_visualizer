import FetchMemberList from "./FetchMemberList";
import Filter from "./Filter";
import { useState } from "react";

export default function MembersList() {
  const [MemberList, setMembersList] = useState([]);
  return (
    <div className="MembersList">
      <FetchMemberList
        setMembersList={setMembersList}
        MemberList={MemberList}
      />
      <Filter MemberList={MemberList} />
    </div>
  );
}
