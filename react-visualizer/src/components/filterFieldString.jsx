import React, { useState, useRef } from "react";
import styles from "./Filter.module.css";
export default function filterFieldString({ name, setQuery }) {
  function clean(name) {
    return name === "address1"
      ? "Address: "
      : name.charAt(0).toUpperCase() +
          name.slice(1).replaceAll("_", " ") +
          ": ";
  }
  return (
    <div className={styles.filterField}>
      <label>{`${clean(name)}`}</label>
      <input
        id={`adv_${name}`}
        //value={queryParameters.current.get({ name }) || ""}
        type="text"
        onChange={(e) => setQuery(name, e.target.value)}
      />
    </div>
  );
}
