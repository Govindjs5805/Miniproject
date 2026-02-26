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
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate("/")}>
        IBENTO
      </div>

      <div className="nav-links">

        <NavLink to="/home">Home</NavLink>
        <NavLink to="/events">Events</NavLink>

        {user && role === "student" && (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/my-events">My Events</NavLink>
          </>
        )}

        {user && role === "clubLead" && (
          <>
            <NavLink to="/admin">Dashboard</NavLink>
            <NavLink to="/admin/create-event">Create Event</NavLink>
          </>
        )}

        {user && role === "superAdmin" && (
          <NavLink to="/superadmin">Dashboard</NavLink>
        )}

        {!user && (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}

        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;