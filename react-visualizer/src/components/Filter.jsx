import React, { useState, useRef } from "react";
import Member from "./Member";

export default function Filter({ MemberList = [] }) {
  const [query, setQuery] = useState("");
  const [reRender, setReRender] = useState(false);
  let queryParameters = useRef(new Map());

  const filteredMembers = MemberList.filter((member) => {
    const fields = member.fields;
    if (!queryParameters.current.size && query !== "") {
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
    } //end of 'naive' search w/o terms
    else if (!queryParameters.current.size && query === "") {
      return true;
    }
    //if our user used parameters
    else if (queryParameters.current.size > 0) {
      let matches = 0;
      for (const [key, term] of queryParameters.current) {
        console.log(`HEYYY OVER HERE ${key}:${term} and fields is ${fields}`);
        if (!fields[key].toString().toLowerCase().includes(term)) {
          //we know this isn't our guy, don't bother completing the loop
          break;
        } else {
          //great, now keep checking for more matches...
          matches++;
        }
      }
      if (matches === queryParameters.current.size) {
        return true;
      } else {
        return false;
      }
    }
  });

  function handleSubmit(e) {
    e.preventDefault();
    queryParameters.current.clear(); //to prevent parameters lingering from previous search
    if (query.includes(":")) {
      //we know the user is using parameters in this case
      const keyValuePairs = query
        .toLowerCase()
        .match(/(?:[^\s:"']+|['"][^'"]*["'])+/g);
      console.log(keyValuePairs);
      for (let i = 0; i < keyValuePairs.length - 1; i += 2) {
        queryParameters.current.set(keyValuePairs[i], keyValuePairs[i + 1]);
        console.log(
          keyValuePairs[i] + ":" + queryParameters.current.get(keyValuePairs[i])
        );
      }
    }
    setReRender(!reRender);
  }

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
        />
        <button>Go!</button>
      </form>
      <div key={reRender}>
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
