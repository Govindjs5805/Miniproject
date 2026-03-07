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

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* LOGO */}
          <div className="nav-logo" onClick={() => { navigate("/"); closeMenu(); }}>
            IBENTO
          </div>

          {/* LINKS SECTION */}
          <div className={`nav-links ${isMobileMenuOpen ? "mobile-active" : ""}`}>
            <NavLink to="/home" onClick={closeMenu}>Home</NavLink>
            <NavLink to="/events" onClick={closeMenu}>Events</NavLink>
            <NavLink className="nav-link-login" to="/login" onClick={closeMenu}>Login</NavLink>
            <NavLink className="nav-link-register" to="/register" onClick={closeMenu}>Register</NavLink>

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
              <>
                <NavLink to="/superadmin" onClick={closeMenu}>Dashboard</NavLink>
              </>
            )}

            {user && (
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>

          {/* HAMBURGER ICON */}
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

      {/* CLICK OUTSIDE TO CLOSE - Only shows when menu is open */}
      {isMobileMenuOpen && (
        <div className="nav-overlay" onClick={closeMenu}></div>
      )}
    </>
  );
}

export default Navbar;