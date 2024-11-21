import React, { useState, useRef } from "react";
import styles from "./Filter.module.css";
export default function filterFieldDropdown({
  name,
  selectOptions = [],
  setQuery,
}) {
  function clean(name) {
    return name === "student_yes_no"
      ? "Student?: "
      : name.charAt(0).toUpperCase() +
          name.slice(1).replaceAll("_", " ") +
          ": ";
  }

  return (
    <div className={styles.filterField}>
      <label>{`${clean(name)}`}</label>
      <select
        id={`adv_${name}`}
        name={`adv_${name}`}
        onChange={(e) => setQuery(name, e.target.value)}
      >
        {selectOptions.map((curOption) => (
          <option value={curOption} key={`adv_${curOption}`}>
            {curOption}
          </option>
        ))}
      </select>
    </div>
  );
}
