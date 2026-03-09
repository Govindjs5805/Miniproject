import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./SuperAdminDashboard.css";

// Sub-components for different views
import AdminOverview from "./AdminOverview";
import SuperAdminRegistrations from "./SuperAdminRegistrations";
import SuperAdminFeedbacks from "./SuperAdminFeedbacks";
import SuperAdminReports from "./SuperAdminReports";
import AdminDocumentVault from "./SuperAdminDocumentVault";

function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [clubSnap, eventSnap, regSnap] = await Promise.all([
        getDocs(collection(db, "clubs")),
        getDocs(collection(db, "events")),
        getDocs(collection(db, "registrations"))
      ]);

      setClubs(clubSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setEvents(eventSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setRegistrations(regSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchData();
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "" },
    { id: "registrations", label: "Registrations", icon: "" },
    { id: "feedbacks", label: "Feedbacks", icon: "" },
    { id: "reports", label: "Reports", icon: "" },
    { id: "vault", label: "Document Vault", icon: "" },
  ];

  const renderContent = () => {
    if (loading) return <div className="loader">Loading Dashboard Data...</div>;

    switch (activeTab) {
      case "dashboard": return <AdminOverview clubs={clubs} events={events} registrations={registrations} />;
      case "registrations": return <SuperAdminRegistrations events={events} registrations={registrations} />;
      case "feedbacks": return <SuperAdminFeedbacks events={events} />;
      case "reports": return <SuperAdminReports clubs={clubs} events={events} registrations={registrations} />;
      case "vault": return <AdminDocumentVault events={events} />;
      default: return <AdminOverview clubs={clubs} events={events} registrations={registrations} />;
    }
  };

  return (
    <div className="super-admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-box">
             <span className="logo-m">S</span>
          </div>
          <h3>SUPER ADMIN</h3>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="admin-main-content">
        <header className="content-header">
          <h1>{menuItems.find(i => i.id === activeTab)?.label}</h1>
        </header>
        <div className="content-scroll-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default SuperAdminDashboard;