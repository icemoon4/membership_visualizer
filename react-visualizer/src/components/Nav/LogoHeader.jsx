import styles from "./logoHeader.module.css";
export default function LogoHeader() {
  return (
    <header className={styles.logoHeader}>
      <img src="\src\assets\headerlogo-400x400.png" />
      <h2>
        DSA <br />
        Membership
        <br />
        Visualizer
      </h2>
    </header>
  );
}
