import styles from "./Filter.module.css";
import React, { useState, useRef } from "react";
import FilterFieldString from "./filterFieldString.jsx";
import FilterFieldBool from "./filterFieldBool.jsx";
import FilterFieldDropdown from "./filterFieldDropdown.jsx";
import FilterFieldDatepicker from "./filterFieldDatepicker.jsx";
import mainStyles from "../../app.module.css";

export default function advancedFilter({ setStateParameters, isVisible }) {
  const [currentParameters, setCurrentParameters] = useState({});
  const [resetDates, setResetDates] = useState(false);

  const allSearchableFields = [
    "first_name",
    "last_name",
    "email",
    "do_not_call",
    "best_phone",
    //"join_date",
    "join_date_after",
    "join_date_before",
    "xdate_after",
    "xdate_before",
    "membership_status",
    "union_member",
    "union_name",
    "student_yes_no",
    "student_school_name",
    "mailing_pref",
    "address1",
    "city",
    "state",
    "zip",
    "new_member_past_month",
    "discord_name",
    "discord_status",
    "vaccinated",
    "do_not_text",
    "do_not_email",
    "in_chapter",
  ];

  const stringFields = [
    "first_name",
    "last_name",
    "email",
    "best_phone",

    "union_name",
    "student_school_name",
    "address1",
    "city",
    "zip",

    "discord_name",
    "discord_status",
  ];

  const dateFields = [
    "join_date_before",
    "join_date_after",
    "xdate_before",
    "xdate_after",
  ];

  const boolFields = [
    "do_not_call",
    "union_member",
    "new_member_past_month",
    "vaccinated",
    "do_not_text",
    "do_not_email",
    "in_chapter",
  ];

  const stateFields = [
    "",
    "MA",
    "VT",
    "NH",
    "CT",
    "RI",
    "ME",
    "AL",
    "AK",
    "AS",
    "AZ",
    "AR",
    "CA",
    "CO",
    "DE",
    "DC",
    "FM",
    "FL",
    "GA",
    "GU",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "MH",
    "MD",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "MP",
    "OH",
    "OK",
    "OR",
    "PW",
    "PA",
    "PR",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VI",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  const membershipFields = ["", "Member", "Member in Good Standing", "Lapsed"];

  function setQuery(key, value) {
    value = value.toString().toLowerCase();
    if (key === "union_member") {
      value = value === "true" ? "yes" : "no";
    }
    setCurrentParameters((prevParams) => ({
      ...prevParams,
      [key]: value,
    }));
    //console.log(currentParameters);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStateParameters(currentParameters);
  }

  function clearFilters() {
    document.querySelector("#advancedFilterForm").reset();
    setCurrentParameters({});
    setStateParameters({});
    setResetDates((prev) => !prev);
  }

  return (
    <aside className={styles.filterSideBar}>
      {isVisible && (
        <form
          id="advancedFilterForm"
          style={{ display: isVisible ? "block" : "none" }}
          onSubmit={(e) => handleSubmit(e)}
        >
          {allSearchableFields.map((field) =>
            stringFields.includes(field) ? (
              <FilterFieldString
                name={field}
                key={`component_${field}`}
                setQuery={setQuery}
              />
            ) : boolFields.includes(field) ? (
              <FilterFieldDropdown
                name={field}
                key={`component_${field}`}
                selectOptions={["", "True", "False"]}
                setQuery={setQuery}
              />
            ) : dateFields.includes(field) ? (
              <FilterFieldDatepicker
                name={field}
                key={`component_${field}_${resetDates}`}
                setQuery={setQuery}
                resetDates={resetDates}
                setResetDates={setResetDates}
              />
            ) : field === "membership_status" ? (
              <FilterFieldDropdown
                name={field}
                key={`component_${field}`}
                selectOptions={membershipFields}
                setQuery={setQuery}
              />
            ) : field === "student_yes_no" ? (
              <FilterFieldDropdown
                name={field}
                key={`component_${field}`}
                selectOptions={["", "Yes", "No"]}
                setQuery={setQuery}
              />
            ) : field === "mailing_pref" ? (
              <FilterFieldDropdown
                name={field}
                key={`component_${field}`}
                selectOptions={["", "Yes", "No"]}
                setQuery={setQuery}
              />
            ) : field === "state" ? (
              <FilterFieldDropdown
                name={field}
                key={`component_${field}`}
                selectOptions={stateFields}
                setQuery={setQuery}
              />
            ) : (
              console.log("unrecognized field; how'd you manage this?")
            )
          )}
          <div className={styles.buttonsContainer}>
            <button onClick={handleSubmit} className={mainStyles.redButton}>
              Search
            </button>
            <button onClick={clearFilters} className={mainStyles.whiteButton}>
              Clear filters
            </button>
          </div>
        </form>
      )}
    </aside>
  );
}
