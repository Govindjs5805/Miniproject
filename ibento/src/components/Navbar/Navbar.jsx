import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo" onClick={() => navigate("/home")}>
        IBENTO
      </div>

      {/* Links */}
      <div className="nav-links">

        {/* Guest */}
        {!user && (
          <>
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}

        {/* Student */}
        {user && role === "student" && (
          <>
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/my-events">My Events</NavLink>
          </>
        )}

        {/* Club Lead */}
        {user && role === "clubLead" && (
          <>
                      <NavLink to="/home">Home</NavLink>

            <NavLink to="/admin">Dashboard</NavLink>
            <NavLink to="/admin/create-event">Create Event</NavLink>
          </>
        )}

        {/* Super Admin */}
        {user && role === "superAdmin" && (
          <>
            <NavLink to="/superadmin">Dashboard</NavLink>
          </>
        )}

        {/* Logout */}
        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}

        {/* Dark Mode Toggle */}
        <button
          className="theme-toggle"
          onClick={() => setDark(!dark)}
        >
          {dark ? "Light" : "Dark"}
        </button>

      </div>
    </nav>
  );
}

export default Navbar;