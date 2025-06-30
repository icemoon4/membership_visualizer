import React, { useState, useEffect } from "react";
import FilterChartForm from "../Stats/FilterChartForm";
import styles from "./MemberWeeklies.module.css";
export default function fetchRangeHeader({
  dateRange,
  dates,
  setDates,
  sectionTitle,
}) {
  return (
    <header>
      <h2 className={styles.tableTitle}>{sectionTitle}</h2>
      <FilterChartForm
        datesRange={dateRange}
        asideName="chart"
        defaultDates={dates}
        setDates={setDates}
      />
    </header>
  );
}
