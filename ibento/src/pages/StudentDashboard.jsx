import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) return;
      const q = query(collection(db, "registrations"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      setRegistrations(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchRegistrations();
  }, [user]);

  return (
    <div className="dashboard-wrapper">
      {/* Animated silk background */}
      <div className="dashboard-silk-bg"></div>

      <header className="dashboard-header">
        <h1 className="welcome-text">WELCOME, STUDENT 👋</h1>
        <p className="dashboard-subtitle">Here are the events you have registered for</p>
      </header>

      <main className="dashboard-grid">
        {registrations.length === 0 ? (
          <p className="no-data-text">No active registrations found.</p>
        ) : (
          registrations.map((reg) => (
            <div key={reg.id} className="mini-event-card">
              <div className="card-top-info">
                <h3 className="mini-event-title">{reg.eventTitle}</h3>
                <div className="mini-date-row">
                  <span className="icon"></span>
                  <span className="date-val">{reg.eventDate || "2026-02-27"}</span>
                </div>
              </div>

              <div className="card-status-row">
                <span className={`mini-pill ${reg.checkInStatus ? 'is-present' : 'is-absent'}`}>
                  {reg.checkInStatus ? "● PRESENT" : "○ NOT CHECKED-IN"}
                </span>
                <span className="mini-pill status-info">
                   {reg.status || "Confirmed"}
                </span>
              </div>

              <div className="card-actions-row">
                <button className="dashboard-btn ticket-style" onClick={() => navigate(`/ticket/${reg.id}`)}>
                  View Ticket
                </button>
                
                {reg.checkInStatus && (
                  <button className="dashboard-btn feedback-style" onClick={() => navigate(`/feedback/${reg.eventId}`)}>
                    Feedback
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;