import React, { useState } from "react";
import FilterFieldDatepicker from "../MemberSearch/filterFieldDatepicker.jsx";

export default function FilterChartForm({ asideName }) {
  const [currentParameters, setCurrentParameters] = useState({});
  function setQuery(key, value) {
    setCurrentParameters((prevParams) => ({
      ...prevParams,
      [key]: value,
    }));
  }
  return (
    <form>
      <FilterFieldDatepicker name={`${asideName}_from`} setQuery={setQuery} />
      <FilterFieldDatepicker name={`${asideName}_to`} setQuery={setQuery} />{" "}
      <button>Go!</button>
    </form>
  );
}
