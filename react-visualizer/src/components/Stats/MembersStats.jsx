import React, { useState, useEffect } from "react";
import Chart from "./Chart.jsx";
import styles from "./memberStats.module.css";
import FilterChartForm from "./FilterChartForm.jsx";
import moment from "moment";

export default function MembersStats() {
  const [membershipCounts, setCounts] = useState(null);
  const [cleanedData, setCleanData] = useState(null);
  const [filteredChartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartDates, setChartDates] = useState([]);
  const [tableDates, setTableDates] = useState([]);
  const [tableData, setTableData] = useState([]);

  const data = [];

  useEffect(() => {
    async function fetchMembershipCount() {
      try {
        const res = await fetch(`http://localhost:8000/api/membership_counts/`);
        const data = await res.json();
        setCounts(data);
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
    if (typeof row[1] === "string") {
      //only the header row is made of strings, ergo
      for (let i = 0; i < row.length; i++) {
        row[i] =
          row[i].charAt(0).toUpperCase() + row[i].slice(1).replaceAll("_", " ");
      }
    }
    return row;
  }

  function sortSetDates(datesRange) {
    var dates = datesRange,
      orderedDates = dates.sort(function (a, b) {
        return Date.parse(a) > Date.parse(b);
      });
    //earliest date will be first, latest date is at the end
    setChartDates([orderedDates[0], orderedDates[orderedDates.length - 1]]);
    setTableDates([orderedDates[0], orderedDates[orderedDates.length - 1]]);
  }

  //transforming our json data to fit google charts' data structure
  //cleaning membershipCounts into cleanData effectively
  useEffect(() => {
    if (membershipCounts) {
      let row = Object.keys(membershipCounts[0]);
      let datesRange = [];
      row = cleanRow(row);
      data.push(row);
      for (const week of membershipCounts) {
        datesRange.push(week["list_date"]); //getting our range of dates for comparison
        row = Object.values(week);
        row = cleanRow(row);
        data.push(row);
      }
      setCleanData(data); //our original clean data; revert to this when no filters
      setChartData(data); //acts as our backup
      sortSetDates(datesRange);
    }
  }, [membershipCounts]);

  useEffect(() => {
    if (chartDates && cleanedData) {
      fitChartDataToRange(chartDates, "chart");
    }
  }, [chartDates]);

  useEffect(() => {
    if (tableDates && cleanedData) {
      fitChartDataToRange(tableDates, "table");
    }
  }, [tableDates]);

  function fitChartDataToRange(dates, chartType) {
    if (!dates || Object.keys(dates).length !== 2 || !cleanedData) return;
    const fromDate = moment(dates[0]).format("YYYY-MM-DD"); //make sure all formats match
    const toDate = moment(dates[1]).format("YYYY-MM-DD");
    let transformedData = [cleanedData[0]]; //initializing our array with the header row
    for (let i = 1; i < cleanedData.length; i++) {
      //starting at 1 to skip the header
      const rowDate = moment(cleanedData[i][0]).format("YYYY-MM-DD");
      if (
        moment(rowDate).isBetween(fromDate, toDate) ||
        moment(rowDate).isSame(fromDate) ||
        moment(rowDate).isSame(toDate)
      ) {
        transformedData.push(cleanedData[i]);
      }
    }
    if (chartType === "chart") {
      setChartData(transformedData);
    }
    if (chartType === "table") {
      setTableData(transformedData);
    }
  }

  if (!membershipCounts) {
    return <p>Membership statistics not found.</p>;
  }
  if (isLoading) {
    return <p>Loading statistics...</p>;
  }

  return (
    <main className={styles.statistics}>
      <aside className={styles.numbersAside}>
        <h2>Percent Change Over Time</h2>
        <div className={styles.chartContainer}>
          <FilterChartForm
            dates={tableDates}
            asideName="chart"
            setDates={setTableDates}
          />
          <Chart data={tableData} type="Table" />
        </div>
      </aside>
      <aside className={styles.chartAside}>
        <h1>Area Chart of Membership Trends</h1>

        <div className={styles.chartContainer}>
          <FilterChartForm
            dates={chartDates}
            asideName="chart"
            setDates={setChartDates}
          />
          <Chart data={filteredChartData} type="AreaChart" />
        </div>
      </aside>
    </main>
  );
}
