import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">IBENTO</div>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/clubs">Clubs</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/admin">Admin DashBoard</Link></li>
        <li><Link to="/admin/registrations">Registrations</Link></li>
        <li><Link to="/admin/report">AI Report</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;