import { Link } from "react-router-dom";
import LogoHeader from "./LogoHeader";
import styles from "./nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.navBar}>
      <LogoHeader />
      <div className={styles.pageOptions}>
        <Link to="/">Search</Link>
        <Link to="/Statistics">Statistics</Link>
        <Link to="/Logout">Log out</Link>
      </div>
    </nav>
  );
}
