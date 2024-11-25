import React, { createContext, useState, useEffect } from "react";

export const MembersContext = createContext();

export function MembersProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch(`http://localhost:8000/data`);
        const data = await res.json();
        setMembers(JSON.parse(data));
      } catch (error) {
        console.error("Failed to fetch members", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembers();
  }, []);

  return (
    <MembersContext.Provider value={{ members, isLoading }}>
      {children}
    </MembersContext.Provider>
  );
}
