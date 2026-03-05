import React, { useState } from "react";

function SuperAdminRegistrations({ events, registrations }) {
  const [selectedEventId, setSelectedEventId] = useState("");

  // Filter registrations based on selected event
  const filteredRegs = registrations.filter(reg => reg.eventId === selectedEventId);

  return (
    <div className="admin-section-card">
      <div className="registration-controls">
        <label htmlFor="event-selector">Choose Event:</label>
        <select 
          id="event-selector"
          value={selectedEventId} 
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="admin-dropdown"
        >
          <option value="">-- Select an Event --</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.title} | {event.clubId?.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="registration-content">
        {!selectedEventId ? (
          <div className="no-selection-placeholder">
            <div className="placeholder-icon"></div>
          </div>
        ) : filteredRegs.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Participant Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegs.map((reg) => (
                  <tr key={reg.id}>
                    <td>{reg.userName || "N/A"}</td>
                    <td>{reg.userEmail}</td>
                    <td>
                      <span className={`status-pill ${reg.checkInStatus ? "checked" : "pending"}`}>
                        {reg.checkInStatus ? "Attended" : "Registered"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data-msg">
            <p>No participants have registered for this event yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperAdminRegistrations;