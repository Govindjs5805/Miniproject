import React from "react";

function SuperAdminRegistrations({ events, registrations }) {
  return (
    <div className="admin-section-card">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Participant</th>
            <th>Email</th>
            <th>Event Context</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg) => {
            const event = events.find(e => e.id === reg.eventId);
            return (
              <tr key={reg.id}>
                <td>{reg.userName || "Guest"}</td>
                <td>{reg.userEmail}</td>
                <td>{event?.title || "Deleted Event"}</td>
                <td>
                  <span className={`status-pill ${reg.checkInStatus ? "checked" : "pending"}`}>
                    {reg.checkInStatus ? "Present" : "Registered"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SuperAdminRegistrations;