import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser'; 
import "./StudentDashboard.css";

function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [userName, setUserName] = useState(""); 
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState({});
  
  // New States for Cancellation & Toast
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Helper to show toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  // 1. Fetch User Name (Existing Logic)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
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

  // 2. Fetch Registrations & Feedback (Existing Logic)
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

  // 3. Cancellation Request Logic (Updated with Custom Toast)
  const handleCancelRequest = async () => {
    if (!selectedReg) return;
    setIsSending(true);

    const templateParams = {
      from_name: userName,
      from_email: user.email,
      event_name: selectedReg.eventTitle,
      registration_id: selectedReg.id,
      subject: "Request for Cancellation",
      message: `User ${userName} (${user.email}) has requested to cancel their registration for the event: ${selectedReg.eventTitle}.`
    };

    try {
      await emailjs.send(
        'service_3u2u3we',   
        'template_f9axmxh',  
        templateParams,
        'oxGLsxqSlC6va58K6'    
      );
      // Replaced alert with custom toast
      showToast("Cancellation request sent successfully!");
      setShowCancelModal(false);
    } catch (error) {
      console.error("EmailJS Error:", error);
      showToast("Failed to send request.", "error");
    } finally {
      setIsSending(false);
      setSelectedReg(null);
    }
  };

  const openCancelModal = (reg) => {
    setSelectedReg(reg);
    setShowCancelModal(true);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-silk-bg"></div>

      {/* Custom Green Toast Notification */}
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>
          <div className="toast-content">{toast.message}</div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showCancelModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h3>Request Cancellation?</h3>
            <p>This will send a formal request to the admin to cancel your registration for <strong>{selectedReg?.eventTitle}</strong>.</p>
            <div className="modal-btns">
              <button className="modal-btn-confirm" onClick={handleCancelRequest} disabled={isSending}>
                {isSending ? "Sending..." : "Confirm Request"}
              </button>
              <button className="modal-btn-cancel" onClick={() => setShowCancelModal(false)}>Back</button>
            </div>
          </div>
        </div>
      )}

      <header className="dashboard-header">
        <h1 className="welcome-text">
            WELCOME, {userName ? userName.toUpperCase() : "..."} 
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
                {!reg.checkInStatus && (
                   <button className="cancel-req-link" onClick={() => openCancelModal(reg)}>
                     Request Cancellation
                   </button>
                )}
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