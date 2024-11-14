import styles from "./Filter.module.css";
import React, { useState, useRef } from "react";
import FilterFieldString from "./filterFieldString.jsx";
import FilterFieldBool from "./filterFieldBool.jsx";
import FilterFieldDropdown from "./filterFieldDropdown.jsx";

export default function advancedFilter({ setStateParameters }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentParameters, setCurrentParameters] = useState({});

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const allSearchableFields = [
    "first_name",
    "last_name",
    "email",
    "do_not_call",
    "best_phone",
    "join_date",
    "xdate",
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
    "list_date",
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
    "join_date",
    "xdate",
    "union_name",
    "student_school_name",
    "address1",
    "city",
    "zip",
    "list_date",
    "discord_name",
    "discord_status",
  ];

  const dropdownFields = ["", "membership_status", "mailing_pref", "state"];

  const boolFields = [
    "do_not_call",
    "union_member",
    "student_yes_no",
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
    console.log("is this getting called");
    value = value.toString().toLowerCase();
    if (key === "union_member") {
      value = value === "true" ? "yes" : "no";
    }
    setCurrentParameters((prevParams) => ({
      ...prevParams,
      [key]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("heyyyy helpppp", currentParameters);
    setStateParameters(currentParameters);
  }

  function clearFilters() {
    document.querySelector("#advancedFilterForm").reset();
    setCurrentParameters({});
    setStateParameters({});
  }

  return (
    <div id="advancedFilterComponent">
      <button onClick={toggleVisibility}>
        {isVisible ? "Close" : "Open"} advanced search
      </button>
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
              <FilterFieldBool
                name={field}
                key={`component_${field}`}
                setQuery={setQuery}
              />
            ) : field === "membership_status" ? (
              <FilterFieldDropdown
                name={field}
                key={`component_${field}`}
                selectOptions={membershipFields}
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
          <button onClick={handleSubmit}>Search</button>
          <button onClick={clearFilters}>Clear filters</button>
        </form>
      )}
    </div>
  );
}
