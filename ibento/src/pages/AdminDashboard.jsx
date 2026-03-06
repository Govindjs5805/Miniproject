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

  // Custom Modal & Toast States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const loadData = async () => {
    if (!clubId || !user) return;
    setLoading(true);
    try {
      const adminDoc = await getDoc(doc(db, "users", user.uid));
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        setAdminName(data.fullName || data.name || "Admin");
      }

      const eventQuery = query(collection(db, "events"), where("clubId", "==", clubId));
      const eventSnap = await getDocs(eventQuery);
      const fetchedEvents = eventSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setEvents(fetchedEvents);
      setTotalEvents(eventSnap.size);

      const eventIds = fetchedEvents.map(ev => ev.id);
      if (eventIds.length === 0) return;

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

  const triggerDeleteRequest = (event) => {
    setEventToDelete(event);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    
    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, "events", eventToDelete.id));

      const regQ = query(collection(db, "registrations"), where("eventId", "==", eventToDelete.id));
      const regS = await getDocs(regQ);
      regS.forEach(d => batch.delete(d.ref));

      const feedQ = query(collection(db, "feedbacks"), where("eventId", "==", eventToDelete.id));
      const feedS = await getDocs(feedQ);
      feedS.forEach(d => batch.delete(d.ref));

      await batch.commit();
      
      setEvents(events.filter(e => e.id !== eventToDelete.id));
      setTotalEvents(prev => prev - 1);
      
      // Close modal and show success toast
      setIsModalOpen(false);
      setEventToDelete(null);
      setShowSuccessToast(true);
      
      // Auto-hide toast after 3 seconds
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting event.");
    } finally {
      setIsDeleting(false);
    }
  };

  const attendancePercentage = totalRegistrations > 0 
    ? ((totalCheckedIn / totalRegistrations) * 100).toFixed(1) 
    : 0;

  return (
    <AdminLayout>
      <div className="admin-dash-content">
        
        {/* GREEN SUCCESS TOAST */}
        {showSuccessToast && (
          <div className="success-toast-container">
            <div className="success-toast-content">
              <span className="toast-icon">✅</span>
              <p>Event and associated data deleted successfully!</p>
            </div>
          </div>
        )}

        {/* CUSTOM DELETE MODAL */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="custom-modal-card">
              <div className="modal-icon-warning">⚠️</div>
              <h3 className="modal-title">Confirm Deletion</h3>
              <p className="modal-text">
                Are you sure you want to delete <strong>"{eventToDelete?.title}"</strong>? 
                This action is permanent and will wipe all registration and feedback data.
              </p>
              <div className="modal-actions">
                <button 
                  className="modal-cancel-btn" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  className="modal-confirm-btn" 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </div>
          </div>
        )}

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
                          onClick={() => triggerDeleteRequest(event)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data-text">No events found.</td>
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