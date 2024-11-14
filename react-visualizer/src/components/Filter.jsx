import React, { useState, useRef } from "react";
import Member from "./Member";
import AdvancedFilter from "./advancedFilter.jsx";
import SearchFilter from "./SearchFilter.jsx";
import styles from "./Filter.module.css";

export default function Filter({ MemberList = [] }) {
  const [query, setQuery] = useState("");
  const [stateParameters, setStateParameters] = useState({}); //obj instead of map for ease of adding params
  const [reRender, setReRender] = useState(false);

  const filteredMembers = MemberList.filter((member) => {
    const fields = member.fields;
    //console.log(member);
    const numOfParams = Object.keys(stateParameters).length;
    if (!numOfParams && query !== "") {
      //this is our simple query, w/o params logic
      //console.log("queryParameters length 0");
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
      for (const key of Object.keys(stateParameters)) {
        //console.log(Object.keys(stateParameters).length);
        //console.log(`Checking ${key}: searching for '${fields[key]}'`);
        const searchTerm = stateParameters[key];
        const memberTerm =
          fields[key] !== null ? fields[key].toString().toLowerCase() : ""; //ternary to make sure we don't call toString on null/undefined
        console.log(
          `Checking ${key}: searching for '${searchTerm}' in '${memberTerm}'`
        );
        if (!memberTerm.includes(searchTerm)) {
          return false; //not our guy
        }
      }
      return true;
    }
  });

  return (
    <div className={styles.fullPage}>
      <SearchFilter
        setStateParameters={setStateParameters}
        query={query}
        setQuery={setQuery}
        setReRender={setReRender}
        reRender={reRender}
      />
      <div className={styles.filterSideBar}>
        <AdvancedFilter setStateParameters={setStateParameters} />
      </div>
      <div className={styles.membersList} key={reRender}>
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <Member key={member.pk} fields={member.fields} />
          ))
        ) : (
          <li>No results found</li>
        )}
      </div>
    </div>
  );
}
