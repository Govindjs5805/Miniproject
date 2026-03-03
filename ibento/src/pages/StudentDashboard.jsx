import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [userName, setUserName] = useState("STUDENT"); // Default fallback

  // 1. Fetch User Profile Data (To get the Real Name)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      try {
        // Assuming your user details are in a 'users' collection with the UID as the Doc ID
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          // Use 'fullName' or 'name' based on what you used in your Register.jsx
          setUserName(data.fullName || data.name || "STUDENT");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUserProfile();
  }, [user]);

  // 2. Fetch Event Registrations
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
        {/* Personalized Welcome Message */}
        <h1 className="welcome-text">WELCOME, {userName.toUpperCase()} 👋</h1>
        <p className="dashboard-subtitle">Here are the events you have registered for</p>
      </header>

      <main className="dashboard-grid">
        {registrations.length === 0 ? (
          <div className="no-data-card">
            <p className="no-data-text">No active registrations found.</p>
            <button className="dashboard-btn ticket-style" onClick={() => navigate('/events')}>
              Browse Events
            </button>
          </div>
        ) : (
          registrations.map((reg) => (
            <div key={reg.id} className="mini-event-card">
              <div className="card-top-info">
                <h3 className="mini-event-title">{reg.eventTitle}</h3>
                <div className="mini-date-row">
                  <span className="icon">📅</span>
                  <span className="date-val">{reg.eventDate || "TBA"}</span>
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