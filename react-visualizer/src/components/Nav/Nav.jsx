import { Link } from "react-router-dom";
import LogoHeader from "./LogoHeader";
import styles from "./nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.navBar}>
      <LogoHeader />
      <div className={styles.pageOptions}>
        <Link to="/admin">Admin</Link>
        <Link to="/app/search">Search</Link>
        <Link to="/app/statistics">Statistics</Link>
        <Link to="/app/logout">Log out</Link>
      </div>
    </nav>
  );
}
