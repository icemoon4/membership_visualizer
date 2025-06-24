import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';
export const MembersContext = createContext();

export function MembersProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await axios.get('/api/data');
        const data = await res.json();
        setMembers(res.data);
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
