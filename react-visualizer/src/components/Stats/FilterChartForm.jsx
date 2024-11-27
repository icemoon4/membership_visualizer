import React, { useState } from "react";
import FilterFieldDatepicker from "../MemberSearch/filterFieldDatepicker.jsx";

export default function FilterChartForm({
  asideName,
  chartDates,
  setChartDates,
}) {
  const [currentParameters, setCurrentParameters] = useState({});
  function setQuery(key, value) {
    setCurrentParameters((prevParams) => ({
      ...prevParams,
      [key]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setChartDates(Object.values(currentParameters));
  }
  return (
    <form>
      <FilterFieldDatepicker
        name={`${asideName}_from`}
        setQuery={setQuery}
        defaultDate={chartDates[0]}
      />
      <FilterFieldDatepicker
        name={`${asideName}_to`}
        setQuery={setQuery}
        defaultDate={chartDates[1]}
      />{" "}
      <button onClick={(e) => handleSubmit(e)}>Go!</button>
    </form>
  );
}
