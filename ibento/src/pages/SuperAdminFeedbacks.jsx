import React from "react";

function SuperAdminFeedbacks({ events }) {
  return (
    <div className="admin-feedback-container">
      <div className="info-glass-card">
        <h3>User Feedback Hub</h3>
        <p>Monitoring participant satisfaction across all campus activities.</p>
        
        <div className="forum-events-grid" style={{ marginTop: "30px", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {events.map(event => (
            <div key={event.id} className="modern-event-card">
              <div className="modern-card-info">
                <h3 style={{ fontSize: "1rem" }}>{event.title}</h3>
                <p>Organizer: {event.clubId?.toUpperCase()}</p>
                <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#a78bfa", fontWeight: "bold" }}>★ 4.8</span>
                  <button className="view-btn" style={{ padding: "5px 10px", fontSize: "0.8rem" }}>Review</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminFeedbacks;