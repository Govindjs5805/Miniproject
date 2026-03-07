import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import "./SuperAdminFeedback.css"; 

function SuperAdminFeedback({ events }) {
  const [selectedEventId, setSelectedEventId] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!selectedEventId) {
        setFeedbacks([]);
        return;
      }

      setLoading(true);
      try {
        const q = query(collection(db, "feedbacks"), where("eventId", "==", selectedEventId));
        const querySnapshot = await getDocs(q);
        const feedbackList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFeedbacks(feedbackList);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
      setLoading(false);
    };

    fetchFeedback();
  }, [selectedEventId]);

  return (
    <div className="admin-section-card">
      <header className="vault-header">
        <h2 className="dash-welcome">Event Feedbacks</h2>
      </header>

      {/* FILTER SECTION */}
      <div className="registration-controls">
        <div className="input-box">
          <label htmlFor="feedback-selector">Choose Event:</label>
          <select 
            id="feedback-selector"
            value={selectedEventId} 
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="admin-dropdown report-input"
          >
            <option value="">-- Select an Event to View Feedback --</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.title} ({event.clubId?.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FEEDBACK DISPLAY */}
      <div className="feedback-content">
        {!selectedEventId ? (
          <div className="no-selection-placeholder">
          </div>
        ) : loading ? (
          <p className="loader">Loading feedback...</p>
        ) : feedbacks.length > 0 ? (
          <div className="feedback-grid">
            {feedbacks.map((item) => (
              <div key={item.id} className="feedback-card animate-fade">
                <div className="feedback-header">
                  <div className="user-info-block">
                    {/* Removed email, focused on the Name and Entry ID */}
                    <span className="user-name">{item.userName || "Anonymous Student"}</span>
                    <span className="admin-status-badge"></span>
                  </div>
                </div>

                {/* DYNAMIC RESPONSES SECTION */}
                <div className="responses-list">
                  {item.responses && Object.entries(item.responses).map(([question, answer], idx) => (
                    <div key={idx} className="response-row">
                      <p className="question-label">{question}</p>
                      {typeof answer === "number" ? (
                        <div className="star-rating">
                          <span className="stars-filled">{"★".repeat(answer)}</span>
                          <span className="stars-empty">{"★".repeat(5 - answer)}</span>
                        </div>
                      ) : (
                        <p className="answer-text">{answer || "No response"}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="feedback-footer">
                   <span className="feedback-date">
                     Submitted: {item.submittedAt?.toDate ? item.submittedAt.toDate().toLocaleString() : "Recent"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data-msg">
            <p className="vault-empty-msg">No feedback has been submitted for this event yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperAdminFeedback;