import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./MyEvents.css";

function MyEvents() {
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
    <div className="my-events-wrapper">
      <div className="silk-bg"></div>

      <header className="page-header">
        <h1 className="main-heading">MY EVENTS</h1>
        <p className="sub-heading">Track your registrations and access tickets</p>
      </header>

      <main className="events-container">
        {registrations.map((reg) => (
          <div key={reg.id} className="glass-event-card">
            <div className="card-left">
              <h3 className="event-title-small">{reg.eventTitle}</h3>
              <div className="compact-info">
                <span className="info-text">Registered: {reg.eventDate || "2/27/2026"}</span>
                <span className={`status-text-pill ${reg.checkInStatus ? 'is-in' : 'is-out'}`}>
                  {reg.checkInStatus ? "● CHECKED IN" : "○ NOT CHECKED IN"}
                </span>
              </div>
            </div>

            <div className="card-right">
              <button className="compact-btn view-btn" onClick={() => navigate(`/ticket/${reg.id}`)}>
                View Ticket
              </button>
              
              {reg.checkInStatus ? (
                <button className="compact-btn feed-btn" onClick={() => navigate(`/feedback/${reg.eventId}`)}>
                  Give Feedback
                </button>
              ) : (
                <span className="lock-text">Feedback available after scan-in</span>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default MyEvents;