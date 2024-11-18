import DatePicker from "react-datepicker";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Filter.module.css";

export default function filterFieldDatepicker({ name, setQuery }) {
  const [startDate, setStartDate] = useState(new Date());

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

  return (
    <div className={styles.filterField}>
      <label>{`${clean(name)}`}</label>
      <DatePicker
        selected={startDate}
        onChange={(date) => newSetQuery(name, date)}
      />
    </div>
  );
}
