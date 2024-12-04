import DatePicker from "react-datepicker";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Filter.module.css";

export default function filterFieldDatepicker({
  name,
  setQuery,
  resetDates,
  defaultDate,
  datesRange,
}) {
  const [startDate, setStartDate] = useState(defaultDate || new Date());
  const [initialDatesRange, setDatesRange] = useState([]);
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

  useEffect(() => {
    if (initialDatesRange.length === 0 && datesRange !== undefined) {
      setDatesRange(cleanRange(datesRange));
    }
  }, [datesRange]);

  
  function cleanRange(dates) {
    return dates.map((date) => {
      if (typeof date === "string") {
        return cleanDate(date);
      }
      return date;
    });
  }

  //prevents that crazy issue w/ javascript date-parsing strings structured as yyyy-mm-dd
  //as being one day earlier in timezones before UTC
  function cleanDate(date) {
    return new Date(date.replace(/-/g, "/"));
  }

  useEffect(() => {
    if (defaultDate) {
      let curDate = defaultDate;
      if (typeof defaultDate === "string") {
        curDate = cleanDate(curDate);
        newSetQuery(name, curDate);
      }
      setStartDate(curDate);
    }
  }, [defaultDate]);

  function handleClick() {
    setVisibility(true);
  }

  return (
    <div>
      <label>{`${clean(name)}`}</label>
      <DatePicker
        className={textVisible ? styles.active : styles.inactive}
        selected={startDate}
        onChange={(date) => newSetQuery(name, date)}
        onCalendarOpen={handleClick}
        includeDateIntervals={
          datesRange
            ? [{ start: initialDatesRange[0], end: initialDatesRange[1] }]
            : [{ start: new Date(70, 0, 1), end: new Date() }]
        }
      />
    </div>
  );
}
