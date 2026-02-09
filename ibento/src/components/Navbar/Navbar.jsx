import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        IBENTO
      </div>

      {/* Navigation Links */}
      <ul className="navbar-links">
        {/* GUEST */}
        {!user && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}

        {/* STUDENT */}
        {user && role === "student" && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/my-events">My Events</Link></li>
            <li><Link to="/edit-profile">Profile</Link></li>
          </>
        )}

        {/* ADMIN */}
        {user && role === "admin" && (
          <>
            <li>
              <Link to="/admin">Dashboard</Link>
            </li>
          </>
        )}

        {/* LOGOUT */}
        {user && (
          <li>
            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
