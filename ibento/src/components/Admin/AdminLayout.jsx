import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  const { clubName, clubLogo } = useAuth();

  return (
    <div className="admin-container">
      {/* Side Panel */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand-section">
          <div className="club-logo-container">
            {clubLogo ? (
              <img src={clubLogo} alt="Club Logo" className="sidebar-club-logo" />
            ) : (
              <div className="club-logo-placeholder">
                {clubName ? clubName.charAt(0) : "C"}
              </div>
            )}
          </div>
          <h3 className="sidebar-club-name">{clubName || "Club Admin"}</h3>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? "active" : ""}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/create-event" className={({ isActive }) => isActive ? "active" : ""}>
            Create Event
          </NavLink>
          <NavLink to="/admin/registrations" className={({ isActive }) => isActive ? "active" : ""}>
             Registrations
          </NavLink>
          <NavLink to="/admin/checkin" className={({ isActive }) => isActive ? "active" : ""}>
             Check-In
          </NavLink>
          <NavLink to="/admin/documents" className={({ isActive }) => isActive ? "active" : ""}>
             Documents
          </NavLink>
          <NavLink to="/admin/feedbacks" className={({ isActive }) => isActive ? "active" : ""}>
             Feedbacks
          </NavLink>
          <NavLink to="/admin/report" className={({ isActive }) => isActive ? "active" : ""}>
             Reports
          </NavLink>

        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;