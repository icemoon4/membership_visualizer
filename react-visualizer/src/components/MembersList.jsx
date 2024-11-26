import { MembersContext } from "./MembersContext";
import Filter from "./Filter/Filter";
import Nav from "./Nav";
import { useState, useContext } from "react";

export default function MembersList() {
  const { members, isLoading } = useContext(MembersContext);
  if (isLoading) {
    return <p>Loading members...</p>;
  }
  return (
    <div className="MembersList">
      <Filter MemberList={members} />
    </div>
  );
}
