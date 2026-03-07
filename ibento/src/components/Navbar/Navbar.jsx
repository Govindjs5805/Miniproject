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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile toggle

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("role");
    setIsMobileMenuOpen(false); // Close menu on logout
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-logo" onClick={() => { navigate("/"); closeMenu(); }}>
          IBENTO
        </div>

        {/* Hamburger Menu Icon */}
        <div className={`menu-toggle ${isMobileMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Links Section */}
        <div className={`nav-links ${isMobileMenuOpen ? "mobile-active" : ""}`}>
          <NavLink to="/home" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/events" onClick={closeMenu}>Events</NavLink>

          {user && role === "student" && (
            <NavLink to="/dashboard" onClick={closeMenu}>My Events</NavLink>
          )}

          {user && role === "clubLead" && (
            <>
              <NavLink to="/admin" onClick={closeMenu}>Dashboard</NavLink>
              <NavLink to="/admin/create-event" onClick={closeMenu}>Create Event</NavLink>
            </>
          )}

          {user && role === "superAdmin" && (
            <NavLink to="/superadmin" onClick={closeMenu}>Dashboard</NavLink>
          )}

          {!user && (
            <>
              <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
              <NavLink to="/register" onClick={closeMenu}>Register</NavLink>
            </>
          )}

          {user && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;