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
  const [userName, setUserName] = useState(""); // Start empty to check loading state
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState({});

  // 1. Fetch User Name from 'users' collection
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      try {
        // Double check your Firestore collection name is 'users' 
        // and the field is 'fullName'
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          // We prioritize fullName, then display name, then fallback to 'STUDENT'
          setUserName(data.fullName || data.name || user.displayName || "STUDENT");
        } else {
          setUserName(user.displayName || "STUDENT");
        }
      } catch (err) { 
        console.error("Error fetching username:", err); 
        setUserName("STUDENT");
      }
    };
    fetchUserProfile();
  }, [user]);

  // 2. Fetch Registrations & Check Feedback Status
  useEffect(() => {
    const fetchRegistrationsAndFeedback = async () => {
      if (!user) return;

      try {
        const q = query(collection(db, "registrations"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        const regData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRegistrations(regData);

        const fQuery = query(collection(db, "feedbacks"), where("userId", "==", user.uid));
        const fSnap = await getDocs(fQuery);
        
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
        {/* If userName is still loading, show a space or '...' */}
        <h1 className="welcome-text">
            WELCOME, {userName ? userName.toUpperCase() : "..."} 👋
        </h1>
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
                <p className="date-val">{reg.eventDate || "TBA"}</p>
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
                    <button className="dashboard-btn feedback-submitted" disabled>
                      Feedback Submitted
                    </button>
                  ) : (
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