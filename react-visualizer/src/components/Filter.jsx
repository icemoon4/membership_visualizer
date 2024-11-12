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

  let queryTerms = useRef(new Map());

  const filteredMembers = MemberList.filter((member) => {
    const fields = member.fields;
    if (!queryTerms.current.size) {
      console.log("queryterms length 0");
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
    else if (queryTerms.current.size > 0) {
      console.log("queryterms length greater than 1");
      for (const [key, term] of queryTerms.current) {
        console.log(`HEYYY OVER HERE ${key}:${term}`);
      }
    }
  });

  function parseQuery(e) {
    const term = e.target.value;
    queryTerms.current.clear();
    //we assume if : is present, then the user is searching by field
    if (term.includes(":")) {
      //regex that splits on spaces and : that are not in quotation marks
      //we're assuming the user input their fields correctly: that the filter is first (odd), and what they're filtering is second (even)
      const searchFields = term.match(/(?:[^\s:"']+|['"][^'"]*["'])+/g);
      console.log(searchFields);
      for (const i in searchFields) {
        for (const j in allFields) {
          if (allFields[j].includes(searchFields[i])) {
            if (i < searchFields.length - 1) {
              //so queryTerms will have a key first_name:  with value alex, etc
              queryTerms.current.set(searchFields[i], searchFields[i + 1]);
              console.log(
                "added to queryTerms, queryTerms.size ",
                queryTerms.current.size
              );
            }
          }
        }
      }
    }
    setQuery(e.target.value.toLowerCase());
  }

  function handleSubmit(e) {

  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {console.log(MemberList)}
        <input value={query} onChange={(e) => parseQuery(e)} type="text" />
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
