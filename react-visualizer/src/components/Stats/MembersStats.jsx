import React, { useState, useEffect } from "react";
import Chart from "./Chart.jsx";
import styles from "./memberStats.module.css";
import FilterChartForm from "./FilterChartForm.jsx";

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

  function cleanRow(row) {
    row.splice(2, 1); //removing the notes section (usually null)
    row.splice(0, 1); //removing the week id (useless for our purposes)
    return row;
  }

 

  //transforming our json data to fit google charts' data structure
  useEffect(() => {
    if (membershipCounts) {
      let n = Object.keys(membershipCounts[0]);
      n = cleanRow(n);
      data.push(n);
      for (const week of membershipCounts) {
        n = Object.values(week);
        n = cleanRow(n);
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
    return (
      <main>
        <aside className={styles.numbersAside}>
          <h2>huuu</h2>
          <div className={styles.chartContainer}>
            <Chart data={data} type="Table" />
          </div>
        </aside>
        <aside className={styles.chartAside}>
          <h1>Chart</h1>
          <FilterChartForm />
          <div className={styles.chartContainer}>
            <Chart data={data} type="AreaChart" />
          </div>
        </aside>
      </main>
    );
  }
}
