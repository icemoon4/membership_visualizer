import React, { useState, useRef } from "react";
import Member from "../MemberDisplay/MemberInline.jsx";
import AdvancedFilter from "./advancedFilter.jsx";
import SearchFilter from "./SearchFilter.jsx";
import styles from "./Filter.module.css";
import moment from "moment";

export default function Filter({ MemberList = [] }) {
  const [query, setQuery] = useState("");
  const [stateParameters, setStateParameters] = useState({}); //obj instead of map for ease of adding params
  const [reRender, setReRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dateParameters = [
    { base: "join_date", before: "join_date_before", after: "join_date_after" },
    { base: "xdate", before: "xdate_before", after: "xdate_after" },
  ];

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const filteredMembers = MemberList.filter((member) => {
    //console.log(member);
    const fields = member.fields;
    let localParameters = { ...stateParameters }; //cloning parameters so we can switch things up when we come to dates
    const numOfParams = Object.keys(localParameters).length;
    if (!numOfParams && query !== "") {
      //this is our simple query, w/o params logic
      for (const key in fields) {
        const value = fields[key];
        if (
          value &&
          value.toString().toLowerCase().includes(query.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    } else if (!numOfParams && query === "") {
      return true; //if search is blank, return every member
    } //end of 'naive' search w/o terms
    //if our user used parameters
    else if (numOfParams > 0) {
      //checking if we're searching with dates
      //since date fields have different names from our member.fields, we need to handle them
      //so in the later for loop it doesn't attempt to compare non-existent fields and crash out
      const hasDateFields = dateParameters.some(
        ({ before, after }) =>
          before in localParameters || after in localParameters
      );
      //if we have date fields but handleDates is false this member isn't returned
      //handleDates also removes our date parameters from our localParameters object
      //(if it's true we just continue comparing the remaining parameters in the upcoming for loop)
      if (hasDateFields && !handleDates(fields, localParameters)) {
        return false;
      }
      if (
        localParameters["address1"] &&
        !handleAddress(fields, localParameters)
      ) {
        return false;
      }
      for (const key of Object.keys(localParameters)) {
        //console.log(Object.keys(stateParameters).length);
        //console.log(`Checking ${key}: searching for '${fields[key]}'`);
        const searchTerm = localParameters[key];
        const memberTerm =
          fields[key] !== null ? fields[key].toString().toLowerCase() : ""; //ternary to make sure we don't call toString on null/undefined
        //console.log(`Checking ${key}: searching for '${searchTerm}' in '${memberTerm}'`);
        if (!memberTerm.includes(searchTerm)) {
          return false; //not our guy
        }
      }
      return true;
    }
  });

  //advanced search only has 1 address field whereas member has 2,
  //so we want to use it to look for matches in both
  function handleAddress(fields, localParameters) {
    if (
      fields["address1"].includes(localParameters["address1"]) ||
      fields["address2"].includes(localParameters["address1"])
    ) {
      return true;
    }
    return false;
  }

  function handleDates(fields, localParameters) {
    let match = true;
    for (const { base, before, after } of dateParameters) {
      const hasBefore = localParameters[before];
      const hasAfter = localParameters[after];
      if (hasBefore && hasAfter) {
        //ergo, we know the user wants to filter for members that fall inbetween two dates
        match =
          match &&
          moment(fields[base]).isBetween(
            localParameters[after],
            localParameters[before]
          );
      } else if (hasBefore) {
        match = match && moment(fields[base]).isBefore(localParameters[before]);
      } else if (hasAfter) {
        match = match && moment(fields[base]).isAfter(localParameters[after]);
      }

      //deleting the keys so our filteredMembers method doesn't try to retrieve their values from member.fields
      if (hasBefore) delete localParameters[before];
      if (hasAfter) delete localParameters[after];
    }

    return match;
  }

  return (
    <div className={styles.fullPage}>
      <header className={styles.searchBar}>
        <SearchFilter
          setStateParameters={setStateParameters}
          query={query}
          setQuery={setQuery}
          setReRender={setReRender}
          reRender={reRender}
        />
        <a className={styles.toggleAdvancedSearch} onClick={toggleVisibility}>
          {isVisible ? "Close" : "Open"} advanced search
        </a>
      </header>
      <div className={styles.content}>
        <AdvancedFilter
          setStateParameters={setStateParameters}
          isVisible={isVisible}
        />
        <main className={styles.membersList} key={reRender}>
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <Member
                key={member.pk}
                memberId={member.pk}
                fields={member.fields}
              />
            ))
          ) : (
            <li>No results found</li>
          )}
        </main>
      </div>
    </div>
  );
}
