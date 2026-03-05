import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import "./SuperAdminFeedback.css"; // Ensure you create/update this CSS file

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
        <p className="subtitle">Real-time student reviews and ratings</p>
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
            <p className="vault-empty-msg">Select an event from the dropdown to see feedback.</p>
          </div>
        ) : loading ? (
          <p className="loader">Loading feedback...</p>
        ) : feedbacks.length > 0 ? (
          <div className="feedback-grid">
            {feedbacks.map((item) => (
              <div key={item.id} className="feedback-card animate-fade">
                <div className="feedback-header">
                  <span className="user-name">{item.userName || "Anonymous Student"}</span>
                  <div className="star-rating">
                    <span className="stars-filled">{"★".repeat(item.rating)}</span>
                    <span className="stars-empty">{"☆".repeat(5 - item.rating)}</span>
                  </div>
                </div>
                <p className="feedback-comment">"{item.comment}"</p>
                <div className="feedback-footer">
                   <span className="feedback-date">
                    {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : "Recent"}
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