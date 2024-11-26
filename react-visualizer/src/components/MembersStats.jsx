import React, { useState, useEffect } from "react";
import Chart from "./Chart.jsx";

export default function MembersStats() {
  const [membershipCounts, setCounts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const data = [];

  useEffect(() => {
    async function fetchMembershipCount() {
      try {
        const res = await fetch(`http://localhost:8000/api/membership_counts/`);
        const data = await res.json();
        setCounts(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch membershipCount", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembershipCount();
  }, []);

  //rip this up to reflect the move from apexCharts to googleCharts
  useEffect(() => {
    if (membershipCounts) {
      let n = Object.keys(membershipCounts[0]);
      n.splice(2, 1);
      n.splice(0, 1);
      data.push(n);
      for (const week of membershipCounts) {
        n = Object.values(week);
        n.splice(2, 1);
        n.splice(0, 1);
        data.push(n);
      }
      console.log(data);
    }
  }, [membershipCounts]);

  if (!membershipCounts) {
    return <p>Membership statistics not found.</p>;
  }
  if (isLoading) {
    return <p>Loading statistics...</p>;
  } else {
    return <Chart data={data} />;
  }
}
