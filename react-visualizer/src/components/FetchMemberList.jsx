import React, { useEffect, useState } from "react";
import NewMembersList from "./NewMembersList.jsx";

export default function FetchMemberList({ MemberList, setMembersList }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch(`http://localhost:8000/data`);
        const data = await res.json();
        setMembersList(JSON.parse(data));
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch members", error);
      }
    }

    fetchMembers();
  }, [setMembersList]);

  return <div>{isLoading ? <p>Loading...</p> : <div></div>}</div>;
}
