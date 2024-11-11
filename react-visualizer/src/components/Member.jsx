import styles from "./member.module.css";

export default function Member({ fields }) {
  return (
    <div className={styles.memberCard}>
      <div className={styles.memberTitle}>
        <span>{fields.first_name} </span> <span>{fields.last_name}</span>{" "}
        <span> - {fields.membership_status} </span>
      </div>
      <div>Email: {fields.email}</div>
      <div>
        Address: {fields.address1} {fields.address2}, {fields.city}{" "}
        {fields.state}
      </div>
    </div>
  );
}
