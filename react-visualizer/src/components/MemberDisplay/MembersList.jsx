import { MembersContext } from "../MembersContext";
import Filter from "../MemberSearch/Filter";
import Nav from "../Nav/Nav";
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
