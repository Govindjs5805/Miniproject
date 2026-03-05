import React from "react";

function AdminDocumentVault({ events }) {
  return (
    <div className="admin-vault">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Organizer</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.clubId}</td>
              <td>
                <button className="view-btn">View Documents</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDocumentVault;