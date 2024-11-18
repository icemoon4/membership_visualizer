import styles from "./member.module.css";

export default function Member({ fields }) {
  return (
    <div className={styles.memberCard}>
      <div className={styles.memberTitle}>
        <span>{fields.first_name} </span> <span>{fields.last_name}</span>{" "}
        <span> - {fields.membership_status}</span>
      </div>
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
