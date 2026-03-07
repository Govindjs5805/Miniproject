import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function SuperAdminRegistrations({ events, registrations }) {
  const [selectedEventId, setSelectedEventId] = useState("");
  const [enrichedRegs, setEnrichedRegs] = useState([]);

  useEffect(() => {
    const fetchRealNames = async () => {
      // Filter registrations based on selected event
      const filtered = registrations.filter(reg => reg.eventId === selectedEventId);

      // Enrich filtered registrations with names from 'users' collection
      const updated = await Promise.all(filtered.map(async (reg) => {
        if (!reg.userName || reg.userName === "Student" || reg.userName === "N/A") {
          try {
            const userDoc = await getDoc(doc(db, "users", reg.userId));
            if (userDoc.exists()) {
              return { 
                ...reg, 
                userName: userDoc.data().fullName || userDoc.data().name || "Student" 
              };
            }
          } catch (err) {
            console.error("Error fetching user name:", err);
          }
        }
        return reg;
      }));

      setEnrichedRegs(updated);
    };

    if (selectedEventId) {
      fetchRealNames();
    } else {
      setEnrichedRegs([]);
    }
  }, [selectedEventId, registrations]);

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
        ) : enrichedRegs.length > 0 ? (
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
                {enrichedRegs.map((reg) => (
                  <tr key={reg.id}>
                    <td>{reg.userName}</td>
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