import React, { useState, useRef } from "react";
import Member from "./Member";

export default function Filter({ MemberList = [] }) {
  const [query, setQuery] = useState("");
  const allFields = [
    [
      //these expect strings
      "first_name",
      "middle_name",
      "last_name",
      "email",
      "best_phone",
      "mobile_phone",
      "home_phone",
      "join_date",
      "xdate",
      "membership_type",
      "monthly_dues_status",
      "yearly_dues_status",
      "membership_status",
      "memb_status_letter",
      "union_member",
      "union_name",
      "union_local",
      "accomodations",
      "student_yes_no",
      "student_school_name",
      "address1",
      "address2",
      "city",
      "state",
      "zip",
      "country",
      "dsa_chapter",
      "ydsa_chapter",
      "list_date",
      "discord_name",
      "discord_status",
    ],
    [
      //these expect bools
      "do_not_call",
      "p2ptext_optout",
      "new_member_past_month",
      "vaccinated",
      "do_not_text",
      "do_not_email",
      "in_chapter",
    ],
    ["race", "committee", "region"], //these expect arrays
  ];

  let queryParameters = useRef(new Map());

  const filteredMembers = MemberList.filter((member) => {
    const fields = member.fields;
    if (!queryParameters.current.size) {
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
    //if our user used parameters
    else if (queryParameters.current.size > 0) {
      let matches = 0;
      for (const [key, term] of queryParameters.current) {
        console.log(`HEYYY OVER HERE ${key}:${term} and fields is ${fields}`);
        if (
          !fields[key].toString().toLowerCase().includes(term.toLowerCase())
        ) {
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
      const keyValuePairs = query.match(/(?:[^\s:"']+|['"][^'"]*["'])+/g);
      console.log(keyValuePairs);
      for (let i = 0; i < keyValuePairs.length - 1; i += 2) {
        queryParameters.current.set(keyValuePairs[i], keyValuePairs[i + 1]);
        console.log(
          keyValuePairs[i] + ":" + queryParameters.current.get(keyValuePairs[i])
        );
      }
    }
  }

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        {console.log(MemberList)}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
          type="text"
        />
        <button>Go!</button>
      </form>
      {filteredMembers.length > 0 ? (
        filteredMembers.map((member) => (
          <Member key={member.pk} fields={member.fields} />
        ))
      ) : (
        <li>No results found</li>
      )}
    </div>
  );
}
