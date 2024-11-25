import { MembersContext } from "./FilterMembersPage/MembersContext";
import Filter from "./FilterMembersPage/Filter";
import Nav from "./Nav";
import { useState, useContext } from "react";

export default function MembersList() {
  const { members, isLoading } = useContext(MembersContext);
  if (isLoading) {
    return <p>Loading members...</p>;
  }
  return (
    <div className="MembersList">
      <Nav />
      <Filter MemberList={members} />
    </div>
  );
}
