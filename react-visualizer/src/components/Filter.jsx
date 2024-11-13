import React, { useState, useRef } from "react";
import Member from "./Member";
import AdvancedFilter from "./advancedFilter.jsx";
import styles from "./Filter.module.css";

export default function Filter({ MemberList = [] }) {
  const [query, setQuery] = useState("");
  const [stateParameters, setStateParameters] = useState({}); //obj instead of map for ease of adding params
  const [reRender, setReRender] = useState(false);

  const filteredMembers = MemberList.filter((member) => {
    const fields = member.fields;
    console.log(member);
    const numOfParams = Object.keys(stateParameters).length;
    if (!numOfParams && query !== "") {
      //this is our simple query, w/o params logic
      console.log("queryParameters length 0");
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
      let matches = 0;
      for (const key of Object.keys(stateParameters)) {
        if (fields[key] === null || fields[key] === undefined) {
          break; //if the value is null this is really not our guy
        }
        const searchTerm = stateParameters[key];
        const memberTerm = fields[key].toString().toLowerCase();
        console.log(
          `HEYYY OVER HERE ${key}:${searchTerm} and fields is ${memberTerm}`
        );
        if (!memberTerm.includes(searchTerm)) {
          //we know this isn't our guy, don't bother completing the loop
          break;
        } else {
          //great, now keep checking for more matches...
          matches++;
        }
      }
      if (matches === numOfParams) {
        return true;
      } else {
        return false;
      }
    }
  });

  function handleSubmit(e) {
    e.preventDefault();
    const currentParameters = {};
    setStateParameters({}); //to prevent parameters lingering from previous search
    if (query.includes(":")) {
      //we know the user is using parameters in this case
      const paramPairsArray = query
        .toLowerCase()
        .match(/(?:[^\s:"']+|['"][^'"]*["'])+/g); //so clean those params up and put em in an array
      console.log(paramPairsArray);
      for (let i = 0; i < paramPairsArray.length - 1; i += 2) {
        const key = paramPairsArray[i];
        const value = paramPairsArray[i + 1];
        currentParameters[key] = value;
      }
      setStateParameters(currentParameters); //updates our state to reflect our placeholder parameter object
      console.log(`length is ${Object.keys(stateParameters).length}`);
      console.log(stateParameters);
    }
    setReRender(!reRender); //setting state forces the page to rerender basically
  }

  return (
    <div className={styles.fullPage}>
      <div className={styles.filterSideBar}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            value={query}
            placeholder="first_name:Anton last_name:Faulkner"
            onChange={(e) => setQuery(e.target.value)}
            type="text"
          />
          <button>Go!</button>
        </form>

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
