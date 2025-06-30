import React, { useState } from "react";
import FilterFieldDatepicker from "../MemberSearch/filterFieldDatepicker.jsx";
import styles from "./memberStats.module.css";
import mainStyles from "../../app.module.css";

export default function FilterChartForm({ asideName, datesRange, defaultDates, setDates }) {
  const [currentParameters, setCurrentParameters] = useState({});
  function setQuery(key, value) {
    setCurrentParameters((prevParams) => ({
      ...prevParams,
      [key]: value,
    }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    setDates(Object.values(currentParameters));
  }
  return (
    <form className={styles.chartForm}>
      <FilterFieldDatepicker
        name={`From`}
        setQuery={setQuery}
        defaultDate={defaultDates[0]}
        datesRange={datesRange}
      />
      <FilterFieldDatepicker
        name={`to`}
        setQuery={setQuery}
        defaultDate={defaultDates[1]}
        datesRange={datesRange}
      />{" "}
      <button className={mainStyles.redButton} onClick={(e) => handleSubmit(e)}>
        Go!
      </button>
    </form>
  );
}
