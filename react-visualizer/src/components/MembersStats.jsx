import Nav from "./Nav";
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

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
      const weeklyValues = new Map();

      for (let week of membershipCounts) {
        for (let key of Object.keys(week)) {
          if (!weeklyValues.has(key)) {
            weeklyValues.set(key, [week[key]]);
          } else {
            weeklyValues.set(key, [...weeklyValues.get(key), week[key]]);
          }
        }
      }

    }
  }, [membershipCounts]);

  if (!membershipCounts) {
    return <p>Membership statistics not found.</p>;
  }
  if (isLoading) {
    return <p>Loading statistics...</p>;
  } else {
    return (
      <Chart
        key={isLoading}
        options={chartOptions.options}
        series={chartOptions.series}
        type="pie"
        width={500}
        height={320}
      />
    );
  }
}
