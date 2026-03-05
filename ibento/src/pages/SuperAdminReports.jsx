import React from "react";

function SuperAdminReports({ clubs, events, registrations }) {
  return (
    <div className="admin-reports-container">
      <div className="info-glass-card">
        <h3>Platform Reports</h3>
        <p>Generate detailed analytical reports for all {clubs.length} registered forums.</p>
        
        <div className="kpi-grid" style={{ marginTop: "30px" }}>
          <div className="stat-card">
            <h4>Global Event Summary</h4>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: "10px 0" }}>
              Comprehensive PDF of all {events.length} events.
            </p>
            <button className="view-btn">Download PDF</button>
          </div>
          
          <div className="stat-card">
            <h4>Registration Data</h4>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: "10px 0" }}>
              Full CSV export of {registrations.length} participant records.
            </p>
            <button className="view-btn" style={{ background: "#4c1d95" }}>Export CSV</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminReports;