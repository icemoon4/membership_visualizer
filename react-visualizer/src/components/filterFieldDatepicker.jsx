import DatePicker from "react-datepicker";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Filter.module.css";
import stylesDatepicker from "./filterFieldDatepicker.css?inline";

export default function filterFieldDatepicker({ name, setQuery }) {
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
    }
  }

  function newSetQuery(name, date) {
    setStartDate(date);
    setQuery(name, date);
    setVisibility(true);
  }

  function toggleVisibility() {
    setVisibility(true);
  }

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
