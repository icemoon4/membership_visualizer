import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <div>
      <Link to="/">Search</Link>
      <Link to="/Statistics">Statistics</Link>
    </div>
  );
}
