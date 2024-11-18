import DatePicker from "react-datepicker";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Filter.module.css";
import stylesDatepicker from "./filterFieldDatepicker.css?inline";

export default function filterFieldDatepicker({ name, setQuery }) {
  const [startDate, setStartDate] = useState(new Date());
  const [textVisible, setVisibility] = useState(false);

  function clean(name) {
    return name == "xdate"
      ? "Membership expiry date:"
      : name.charAt(0).toUpperCase() +
          name.slice(1).replaceAll("_", " ") +
          "?: ";
  }

  function newSetQuery(name, date) {
    console.log(`setting ${name} and ${date}`);
    setStartDate(date);
    setQuery(name, date);
  }

  function toggleVisibility() {
    setVisibility(true);
    console.log("why is this not triggering");
  }

  return (
    <div className={styles.filterField} onClick={toggleVisibility}>
      <label>{`${clean(name)}`}</label>
      <DatePicker
        className={textVisible ? "active-datepicker" : "inactive-datepicker"}
        selected={startDate}
        onChange={(date) => newSetQuery(name, date)}
      />
    </div>
  );
}
