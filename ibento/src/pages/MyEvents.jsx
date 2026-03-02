import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./MyEvents.css"

function MyEvents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "registrations"),
          where("userId", "==", user.uid)
        );

        const snap = await getDocs(q);
        const list = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setRegistrations(list);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      }
    };

    fetchRegistrations();
  }, [user]);

  return (
    <div className="my-events-page">
      <div className="my-events-header">
        <h1 className="massive-title">My Events</h1>
        <div className="title-underline"></div>
        <p className="subtitle">Track your registrations and access tickets</p>
      </div>

      <div className="my-events-list">
        {registrations.length === 0 ? (
          <p className="empty-msg">You haven't registered for any events yet.</p>
        ) : (
          registrations.map(reg => (
            <div key={reg.id} className="my-event-card">
              <div className="card-info">
                <h3>{reg.eventTitle}</h3>
                <p className="reg-date">
                  Registered: {reg.registeredAt?.toDate?.().toLocaleDateString() || "N/A"}
                </p>
                <p className={`status-text ${reg.checkInStatus ? 'status-green' : 'status-red'}`}>
                  {reg.checkInStatus ? "● Checked In" : "○ Not Checked In"}
                </p>
              </div>

              <div className="card-actions">
                <button className="ticket-btn" onClick={() => navigate(`/ticket/${reg.id}`)}>
                  View Ticket
                </button>
                
                {/* CHANGE: Logic now strictly checks if the student is Checked In.
                  If true, button is clickable. If false, it shows a status message.
                */}
                {reg.checkInStatus === true ? (
                  <button 
                    className="feedback-btn"
                    onClick={() => navigate(`/feedback/${reg.eventId}`)}
                  >
                    Give Feedback
                  </button>
                ) : (
                  <span className="pending-msg" style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    Available after scan-in
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyEvents;