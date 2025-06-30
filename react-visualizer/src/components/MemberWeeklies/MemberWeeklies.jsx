import React, { useState, useEffect } from "react";
import axios from "redaxios";
import FilterChartForm from "../Stats/FilterChartForm";
import ChangesTable from "./ChangesTable";
import styles from "./MemberWeeklies.module.css";
import FetchRangeHeader from "./fetchRangeHeader";
import classnames from 'classnames';

export default function MemberWeeklies() {
  const [dates, setDates] = useState([]);
  const [dateRange, setRange] = useState([]);
  const [data, setData] = useState([]);
  const [earliestDateLoading, setEarliestDateIsLoading] = useState(true);
  const [rangeNotFound, setRangeNotFound] = useState(false);
  const [membershipLoading, setMembershipIsLoading] = useState(true);

  function setDefaultDates() {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const formatDate = (date) => date.toISOString().split("T")[0];
    const todayStr = formatDate(today);
    const sevenDaysAgoStr = formatDate(sevenDaysAgo);
    setDates([sevenDaysAgoStr, todayStr]);
    console.log("in setDefaultDates:", [sevenDaysAgoStr, todayStr]);
  }

  // setting our default dates as soon as we start
  useEffect(() => {
    setDefaultDates();
    fetchEarliestDate();
  }, []);

  useEffect(() => {
    if (dates.length === 2) {
      fetchMembershipData();
      console.log("Dates", dates);
    }
  }, [dates]);

  async function fetchMembershipData() {
    console.log("in fetchMembershipData:");
    setRangeNotFound(false);
    setMembershipIsLoading(true);
    const formatDate = (date) =>
      date instanceof Date ? date.toISOString().split("T")[0] : date;
    const startDate = formatDate(dates[0]);
    const endDate = formatDate(dates[1]);
    try {
      const res = await fetch(
        `/api/membership-updates/${startDate}/${endDate}`
      );
      if (!res.ok) {
        // Optional: log server-provided error if available
        const errorText = await res.text();
        setRangeNotFound(true);
        throw new Error(`Server error ${res.status}: ${errorText}`);
      }
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error("Failed to fetch membership updates", error);
    } finally {
      setMembershipIsLoading(false);
    }
  }

  async function fetchEarliestDate() {
    setEarliestDateIsLoading(true);
    try {
      const res = await fetch(`/api/earliest_listdate/`);
      const json = await res.json();
      const earliest = json["earliest_date"];
      console.log("earliest ", earliest);
      const today = new Date();
      const formatDate = (date) => date.toISOString().split("T")[0];
      const todayStr = formatDate(today);
      console.log("todayStr", todayStr);
      setRange([earliest, todayStr]);
    } catch (error) {
      console.error("Failed to fetch earliest date", error);
    } finally {
      setEarliestDateIsLoading(false);
    }
  }

  return (
    <main className={[styles.memberWeeklies, styles.dataDisplayMain].join(" ")}>
      <section className={styles.tableContainer}>
        <FetchRangeHeader
          dateRange={dateRange}
          dates={dates}
          setDates={setDates}
          sectionTitle="Membership Changes"
        />
        {rangeNotFound ? (
          <p>
            Data not found for that date range. Try inputting a different range.
          </p>
        ) : membershipLoading || earliestDateLoading ? (
          <p>Loading data...</p>
        ) : (
          <ChangesTable data={data} />
        )}
      </section>
    </main>
  );
}
