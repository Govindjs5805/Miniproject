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
  const [userName, setUserName] = useState("STUDENT");
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState({}); // Stores { eventId: true }

  // 1. Fetch User Name
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().fullName || "STUDENT");
        }
      } catch (err) { console.error(err); }
    };
    fetchUserProfile();
  }, [user]);

  // 2. Fetch Registrations & Check Feedback Status
  useEffect(() => {
    const fetchRegistrationsAndFeedback = async () => {
      if (!user) return;

      try {
        // Get Registrations
        const q = query(collection(db, "registrations"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        const regData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRegistrations(regData);

        // Get Feedbacks submitted by this user
        const fQuery = query(collection(db, "feedbacks"), where("userId", "==", user.uid));
        const fSnap = await getDocs(fQuery);
        
        // Create a map of event IDs that already have feedback
        const feedbackMap = {};
        fSnap.docs.forEach(doc => {
          feedbackMap[doc.data().eventId] = true;
        });
        setSubmittedFeedbacks(feedbackMap);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchRegistrationsAndFeedback();
  }, [user]);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-silk-bg"></div>

      <header className="dashboard-header">
        <h1 className="welcome-text">WELCOME, {userName.toUpperCase()} 👋</h1>
        <p className="dashboard-subtitle">Manage your event participations</p>
      </header>

      <main className="dashboard-grid">
        {registrations.length === 0 ? (
          <p className="no-data-text">No active registrations found.</p>
        ) : (
          registrations.map((reg) => (
            <div key={reg.id} className="mini-event-card">
              <div className="card-top-info">
                <h3 className="mini-event-title">{reg.eventTitle}</h3>
                <p className="date-val"> {reg.eventDate || "TBA"}</p>
              </div>

              <div className="card-status-row">
                <span className={`mini-pill ${reg.checkInStatus ? 'is-present' : 'is-absent'}`}>
                  {reg.checkInStatus ? "● PRESENT" : "○ NOT CHECKED-IN"}
                </span>
              </div>

              <div className="card-actions-row">
                <button className="dashboard-btn ticket-style" onClick={() => navigate(`/ticket/${reg.id}`)}>
                  View Ticket
                </button>
                
                {reg.checkInStatus && (
                  submittedFeedbacks[reg.eventId] ? (
                    /* DISABLED BUTTON IF FEEDBACK EXISTS */
                    <button className="dashboard-btn feedback-submitted" disabled>
                      Feedback Submitted
                    </button>
                  ) : (
                    /* ACTIVE BUTTON IF NO FEEDBACK FOUND */
                    <button className="dashboard-btn feedback-style" onClick={() => navigate(`/feedback/${reg.eventId}`)}>
                      Give Feedback
                    </button>
                  )
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