import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { clubId, user } = useAuth();
  const [adminName, setAdminName] = useState("Admin"); 
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [totalCheckedIn, setTotalCheckedIn] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!clubId || !user) return;
    setLoading(true);
    try {
      // 1. Load Profile
      const adminDoc = await getDoc(doc(db, "users", user.uid));
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        setAdminName(data.fullName || data.name || "Admin");
      }

      // 2. Load Stats and Events List
      const eventQuery = query(collection(db, "events"), where("clubId", "==", clubId));
      const eventSnap = await getDocs(eventQuery);
      const fetchedEvents = eventSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setEvents(fetchedEvents);
      setTotalEvents(eventSnap.size);

      const eventIds = fetchedEvents.map(ev => ev.id);
      if (eventIds.length === 0) {
        setLoading(false);
        return;
      }

      // 3. Load Registrations for metrics
      const regSnap = await getDocs(collection(db, "registrations"));
      let regCount = 0;
      let checkInCount = 0;

      regSnap.forEach(doc => {
        const data = doc.data();
        if (eventIds.includes(data.eventId)) {
          regCount++;
          if (data.checkInStatus || data.attended === true || data.status === "attended") {
            checkInCount++;
          }
        }
      });

      setTotalRegistrations(regCount);
      setTotalCheckedIn(checkInCount);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [clubId, user]);

  const handleDeleteEvent = async (eventId, eventTitle) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${eventTitle}"? This will permanently remove the event, all registrations, and all feedback.`);
    
    if (confirmDelete) {
      try {
        const batch = writeBatch(db);

        // Delete main event doc
        batch.delete(doc(db, "events", eventId));

        // Cleanup registrations
        const regQ = query(collection(db, "registrations"), where("eventId", "==", eventId));
        const regS = await getDocs(regQ);
        regS.forEach(d => batch.delete(d.ref));

        // Cleanup feedbacks
        const feedQ = query(collection(db, "feedbacks"), where("eventId", "==", eventId));
        const feedS = await getDocs(feedQ);
        feedS.forEach(d => batch.delete(d.ref));

        await batch.commit();
        
        // Refresh local UI state
        setEvents(events.filter(e => e.id !== eventId));
        setTotalEvents(prev => prev - 1);
        alert("Event deleted successfully.");
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Error deleting event. Check console.");
      }
    }
  };

  const attendancePercentage = totalRegistrations > 0 
    ? ((totalCheckedIn / totalRegistrations) * 100).toFixed(1) 
    : 0;

  return (
    <AdminLayout>
      <div className="admin-dash-content">
        <header className="dash-header-section">
          <h2 className="dash-welcome">Welcome, {adminName.toUpperCase()}</h2>
          <p className="dash-subtitle">Club Overview Dashboard</p>
        </header>

        <div className="stats-grid-container">
          <StatCard title="Total Events" value={totalEvents} />
          <StatCard title="Total Registrations" value={totalRegistrations} />
          <StatCard title="Total Checked-In" value={totalCheckedIn} />
          <StatCard title="Attendance Rate" value={`${attendancePercentage}%`} />
        </div>

        <div className="admin-info-card-large">
          <h3 className="card-highlight-title">Quick Insights</h3>
          <p className="card-description">
            Your club's overall check-in rate is <strong>{attendancePercentage}%</strong>. 
            Navigate to the <strong>Reports</strong> tab to generate official documentation for completed events.
          </p>
        </div>

        {/* NEW: Event Management Section */}
        <div className="management-table-card">
          <h3 className="card-highlight-title">Manage Club Events</h3>
          <div className="table-responsive">
            <table className="dash-events-table">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map((event) => (
                    <tr key={event.id}>
                      <td className="event-title-cell">{event.title}</td>
                      <td>{event.date}</td>
                      <td>{event.venue}</td>
                      <td style={{ textAlign: "right" }}>
                        <button 
                          className="dash-delete-btn"
                          onClick={() => handleDeleteEvent(event.id, event.title)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data-text">No events found for your club.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="admin-stat-card">
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
  );
}

export default AdminDashboard;