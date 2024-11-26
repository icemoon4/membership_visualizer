import DatePicker from "react-datepicker";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Filter.module.css";

export default function filterFieldDatepicker({
  name,
  setQuery,
  resetDates,
  setResetDates,
}) {
  const [startDate, setStartDate] = useState(new Date());
  const [textVisible, setVisibility] = useState(false);

  function clean(name) {
    if (name === "xdate_before") {
      return "Membership expires before: ";
    } else if (name == "xdate_after") {
      return "Membership expires after: ";
    } else if (name === "join_date_after") {
      return "Joined after: ";
    } else if (name === "join_date_before") {
      return "Joined before: ";
    } else {
      return (
        name.charAt(0).toUpperCase() + name.slice(1).replaceAll("_", " ") + ": "
      );
    }
  }

  function newSetQuery(name, date) {
    setStartDate(date);
    setQuery(name, date);
    setVisibility(true);
  }

  useEffect(() => {
    setStartDate(new Date());
    setVisibility(false);
  }, [resetDates]);

  return (
    <div>
      <label>{`${clean(name)}`}</label>
      <DatePicker
        className={textVisible ? styles.active : styles.inactive}
        selected={startDate}
        onChange={(date) => newSetQuery(name, date)}
      />
    </div>
  );
}
