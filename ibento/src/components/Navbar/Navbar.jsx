import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("role");
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="nav-logo" onClick={() => { navigate("/"); setIsMobileMenuOpen(false); }}>
          IBENTO
        </div>

        {/* The Spacer - This is the secret to Laptop alignment */}
        <div className="nav-spacer"></div>

        {/* Links Section */}
        <div className={`nav-links ${isMobileMenuOpen ? "mobile-active" : ""}`}>
          <NavLink to="/home" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
          <NavLink to="/events" onClick={() => setIsMobileMenuOpen(false)}>Events</NavLink>

          {user && role === "student" && (
            <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>My Events</NavLink>
          )}

          {user && role === "clubLead" && (
            <>
              <NavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</NavLink>
              <NavLink to="/admin/create-event" onClick={() => setIsMobileMenuOpen(false)}>Create Event</NavLink>
            </>
          )}

          {user && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

        {/* Hamburger Icon (Visible only on mobile) */}
        <div 
          className={`menu-toggle ${isMobileMenuOpen ? "active" : ""}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;