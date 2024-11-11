import React, { useState } from "react";
import Member from "./Member";

export default function Filter({ MemberList = [] }) {
  const [query, setQuery] = useState("");

  const filteredMembers = MemberList.filter((member) => {
    const fields = member.fields;
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
  });
  return (
    <div>
      <form>
        {console.log(MemberList)}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
          type="text"
        />
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
