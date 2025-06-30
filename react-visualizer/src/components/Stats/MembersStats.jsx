import React, { useState, useEffect } from "react";
import Chart from "./Chart.jsx";
import styles from "./memberStats.module.css";
import FilterChartForm from "./FilterChartForm.jsx";
import FetchRangeHeader from "../MemberWeeklies/fetchRangeHeader";
import stylesHeader from "../MemberWeeklies/MemberWeeklies.module.css";
import moment from "moment";

export default function MembersStats() {
  const [membershipCounts, setCounts] = useState(null);
  const [cleanedData, setCleanData] = useState(null);
  const [filteredChartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [tableData, setTableData] = useState([]);

  const [dateRangeIsLoading, setDateRangeLoading] = useState(true);

  const [dates, setDates] = useState([]);
  const [dateRange, setDateRange] = useState([]);

  const data = [];

  useEffect(() => {
    async function fetchMembershipCount() {
      try {
        const res = await fetch(`/api/membership_counts/`);
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
    setDates([orderedDates[0], orderedDates[orderedDates.length - 1]]);
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
    if (dates && cleanedData) {
      fitChartDataToRange(dates);
    }
  }, [dates]);

  useEffect(() => {
    fetchDateRanges();
  }, []);

  function fitChartDataToRange(dates) {
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
    setChartData(transformedData);
    setTableData(transformedData);
  }

  async function fetchDateRanges() {
    setDateRangeLoading(true);
    try {
      const res = await fetch(`/api/earliest_listdate/`);
      const json = await res.json();
      const earliest = json["earliest_date"];
      const latest = json["latest_date"];

      setDateRange([earliest, latest]);
    } catch (error) {
      console.error("Failed to fetch earliest date", error);
    } finally {
      setDateRangeLoading(false);
    }
  }
  return (
    <main
      className={[styles.statistics, stylesHeader.dataDisplayMain].join(" ")}
    >
      <FetchRangeHeader
        dateRange={dateRange}
        dates={dates}
        setDates={setDates}
        sectionTitle="WorcDSA Membership Statistics"
      />
      {!membershipCounts ? (
        <p>Membership statistics not found.</p>
      ) : isLoading || dateRangeIsLoading ? (
        <p>Loading statistics...</p>
      ) : (
        <div className={styles.asideContainer}>
          <aside className={styles.numbersAside}>
            <h2>Percent Change Over Time</h2>
            <div className={styles.chartContainer}>
              <Chart data={tableData} type="Table" />
            </div>
          </aside>
          <aside className={styles.chartAside}>
            <h2>Area Chart of Membership Trends</h2>

            <div className={styles.chartContainer}>
              <Chart data={filteredChartData} type="AreaChart" />
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
