import React, { useState } from "react";
import FilterFieldDatepicker from "../MemberSearch/filterFieldDatepicker.jsx";
import styles from "./memberStats.module.css";
import mainStyles from "../../app.module.css";

export default function FilterChartForm({ asideName, dates, setDates }) {
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
        name={`${asideName}_from`}
        setQuery={setQuery}
        defaultDate={dates[0]}
      />
      <FilterFieldDatepicker
        name={`${asideName}_to`}
        setQuery={setQuery}
        defaultDate={dates[1]}
      />{" "}
      <button className={mainStyles.redButton} onClick={(e) => handleSubmit(e)}>
        Go!
      </button>
    </form>
  );
}
