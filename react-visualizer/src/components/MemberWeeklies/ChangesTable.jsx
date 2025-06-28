import { Fragment } from "react";
import styles from "./MemberWeeklies.module.css";

export default function ChangesTable({ data }) {
  const { new_values, updated_values, deleted_values } = data;
  const extractMembers = (obj, type) =>
    Object.entries(obj).map(([id, value]) => {
      //if the type is updated, we've got to go inside current_values to get the new stuff
      //if it isn't, just grab value
      const person = type === "updated" ? value.current_values : value;
      return {
        id,
        first_name: person.first_name,
        last_name: person.last_name,
        email: person.email,
        change_field:
          type === "updated"
            ? Object.keys(value.updated_values).join(", ")
            : "",
        change_from:
          type === "updated"
            ? Object.values(value.updated_values)
                .map(([_, from]) => from)
                .join(",")
            : "",
        change_to:
          type === "updated"
            ? Object.values(value.updated_values)
                .map(([to]) => to)
                .join(",")
            : "",
        type,
      };
    });

  const allMembers = [
    ...extractMembers(new_values, "new"),
    ...extractMembers(updated_values, "updated"),
    ...extractMembers(deleted_values, "deleted"),
  ];

  console.log(allMembers);

  const cleanedMembers = allMembers.map((member) => {
    const cleanedMember = {};
    for (const [key, value] of Object.entries(member)) {
      cleanedMember[key] = value === undefined ? "" : value;
    }
    return cleanedMember;
  });

  if (!data) return <div>Data not found for that range.</div>;
  return (
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Change Type</th>
          <th>Change Field</th>
          <th>Change From</th>
          <th>Change To</th>
        </tr>
      </thead>
      <tbody>
        {cleanedMembers.map(
          ({
            id,
            first_name,
            last_name,
            email,
            type,
            change_field,
            change_from,
            change_to,
          }) => {
            const fields = (change_field || "").split(", ").filter(Boolean);
            const froms = (change_from || "").split(",").filter(Boolean);
            const tos = (change_to || "").split(",").filter(Boolean);

            return (
              <Fragment key={id}>
                <tr className={styles[type]}>
                  <td>{type == "updated" ? first_name : first_name}</td>
                  <td>{type == "updated" ? last_name : last_name}</td>
                  <td>{type == "updated" ? email : email}</td>
                  <td>{type}</td>
                  <td>{fields[0] || ""}</td>
                  <td>{froms[0] || ""}</td>
                  <td>{tos[0] || ""}</td>
                </tr>

                {type === "updated" &&
                  fields.slice(1).map((field, i) => (
                    <tr key={`${id}-${field}`} className={styles[type]}>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{field}</td>
                      <td>{froms[i + 1] || ""}</td>
                      <td>{tos[i + 1] || ""}</td>
                    </tr>
                  ))}
              </Fragment>
            );
          }
        )}
      </tbody>
    </table>
  );
}
