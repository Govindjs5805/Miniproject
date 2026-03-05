import React from "react";

function SuperAdminDocumentVault({ events }) {
  // Helper to find a specific doc type in the documents array
  const getDocByType = (event, type) => {
    if (!event.documents || !Array.isArray(event.documents)) return null;
    return event.documents.find(doc => doc.type === type);
  };

  return (
    <div className="admin-section-card">
      <header className="vault-header">
        <h2 className="dash-welcome">Global Document Vault</h2>
        <p className="subtitle">Reviewing compliance documents uploaded by Club Leads.</p>
      </header>

      <div className="table-responsive" style={{ marginTop: '20px' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Event & Club</th>
              <th>Permission Letter</th>
              <th>Geotag Photo</th>
              <th>Event Photo</th>
              <th>Other Docs</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => {
              const permissionDoc = getDocByType(event, "Permission Letter");
              const geotagDoc = getDocByType(event, "Geotag Photo");
              const eventPhotoDoc = getDocByType(event, "Event Photo");
              const otherDoc = getDocByType(event, "Other Documents");

              return (
                <tr key={event.id}>
                  <td>
                    <strong>{event.title}</strong>
                    <br />
                    <span style={{ fontSize: '0.8rem', color: '#a78bfa' }}>
                      {event.clubId?.toUpperCase()}
                    </span>
                  </td>
                  
                  {/* Permission Letter */}
                  <td>
                    {permissionDoc ? (
                      <a href={permissionDoc.url} target="_blank" rel="noreferrer" className="view-link-btn">View PDF</a>
                    ) : <span className="status-missing">Missing</span>}
                  </td>

                  {/* Geotag Photo */}
                  <td>
                    {geotagDoc ? (
                      <a href={geotagDoc.url} target="_blank" rel="noreferrer" className="view-link-btn">View Image</a>
                    ) : <span className="status-missing">Missing</span>}
                  </td>

                  {/* Event Photo */}
                  <td>
                    {eventPhotoDoc ? (
                      <a href={eventPhotoDoc.url} target="_blank" rel="noreferrer" className="view-link-btn">View Image</a>
                    ) : <span className="status-missing">Missing</span>}
                  </td>

                  {/* Other Documents */}
                  <td>
                    {otherDoc ? (
                      <a href={otherDoc.url} target="_blank" rel="noreferrer" className="view-link-btn">Download</a>
                    ) : <span className="status-none">None</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SuperAdminDocumentVault;