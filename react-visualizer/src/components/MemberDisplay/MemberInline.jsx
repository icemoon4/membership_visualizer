import styles from "./member.module.css";
import { Link } from "react-router-dom";

export default function Member({ memberId, fields }) {
  return (
    <div className={styles.memberCard}>
      <Link
        to={`/app/members/${memberId}`}
        state={{ memberFields: fields }}
        className={styles.memberTitle}
      >
        <span>{fields.first_name} </span> <span>{fields.last_name}</span>{" "}
        <span> - {fields.membership_status}</span>
      </Link>
      <div>Join date: {fields.join_date}</div>
      <div>Expiry date: {fields.xdate}</div>
      <div>Email: {fields.email}</div>
      <div>
        Address: {fields.address1} {fields.address2}, {fields.city}{" "}
        {fields.state} {fields.vaccinated}
      </div>
    </div>
  );
}
