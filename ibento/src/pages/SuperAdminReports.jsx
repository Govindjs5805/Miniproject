import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import "./SuperAdminReport.css";

function SuperAdminReport({ events, registrations }) {
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedbackCount, setFeedbackCount] = useState(0);

  // Every single info piece is now a choice
  const [options, setOptions] = useState({
    executiveSummary: true,
    eventDetails: true,
    detailTitle: true,
    detailDate: true,
    detailVenue: true,
    participationMetrics: true,
    metricRegistrations: true,
    metricAttendance: true,
    metricFeedback: true,
    signature: true,
  });

  const handleCheckboxChange = (e) => {
    setOptions({ ...options, [e.target.name]: e.target.checked });
  };

  useEffect(() => {
    if (selectedEventId) {
      const ev = events.find((e) => e.id === selectedEventId);
      setSelectedEvent(ev);
      fetchFeedbackCount(selectedEventId);
    }
  }, [selectedEventId, events]);

  const fetchFeedbackCount = async (eventId) => {
    const q = query(collection(db, "feedbacks"), where("eventId", "==", eventId));
    const snap = await getDocs(q);
    setFeedbackCount(snap.size);
  };

  const eventRegs = registrations.filter(r => r.eventId === selectedEventId);
  const totalStudents = eventRegs.length;
  const attendedCount = eventRegs.filter(r => r.attended === true || r.status === "attended").length;

  return (
    <div className="report-container-main">
      {/* UI Configuration Card - Every info is a choice here */}
      <div className="report-config-card no-print">
        <h2 className="report-ui-title">Report Configuration</h2>
        
        <div className="config-group">
          <label className="config-label">1. Select Event</label>
          <select 
            value={selectedEventId} 
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="report-dropdown-custom"
          >
            <option value="">-- Choose Event --</option>
            {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>

        <div className="config-group">
          <label className="config-label">2. Select Information to Display</label>
          <div className="options-grid-custom">
            {Object.keys(options).map((key) => (
              <label key={key} className="custom-checkbox-item">
                <input 
                  type="checkbox" 
                  name={key} 
                  checked={options[key]} 
                  onChange={handleCheckboxChange} 
                />
                <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
              </label>
            ))}
          </div>
        </div>

        {selectedEventId && (
          <button className="generate-report-btn" onClick={() => window.print()}>
            Download PDF
          </button>
        )}
      </div>

      {/* REPORT SECTION - Dynamically filtering every line based on choices */}
      {selectedEventId && (
        <div className="official-report-paper" id="printable-report">
          <div className="report-inner-margin">
            <header className="report-paper-header">
              <h1 className="org-name-title">{selectedEvent?.clubId?.toUpperCase() || "ORGANIZING BODY"}</h1>
              <div className="header-divider"></div>
              <p className="doc-subtitle">OFFICIAL EVENT COMPLETION RECORD</p>
            </header>

            <section className="report-paper-body">
              {/* I. EXECUTIVE SUMMARY */}
              {options.executiveSummary && (
                <div className="paper-section">
                  <h3 className="paper-section-title">I. EXECUTIVE SUMMARY</h3>
                  <p className="summary-paragraph">
                    The event "{selectedEvent?.title}" was successfully conducted by {selectedEvent?.clubId?.toUpperCase()} on {selectedEvent?.date}. 
                    Administrative records confirm {totalStudents} student registrations. 
                    Attendance was verified for {attendedCount} participants, and {feedbackCount} formal feedbacks were collected.
                  </p>
                </div>
              )}

              {/* II. EVENT DETAILS */}
              {options.eventDetails && (
                <div className="paper-section">
                  <h3 className="paper-section-title">II. EVENT DETAILS</h3>
                  {options.detailTitle && (
                    <div className="text-data-row">
                      <span className="text-label">Event Title:</span>
                      <span className="text-value">{selectedEvent?.title}</span>
                    </div>
                  )}
                  {options.detailDate && (
                    <div className="text-data-row">
                      <span className="text-label">Organized Date:</span>
                      <span className="text-value">{selectedEvent?.date}</span>
                    </div>
                  )}
                  {options.detailVenue && (
                    <div className="text-data-row">
                      <span className="text-label">Venue Location:</span>
                      <span className="text-value">{selectedEvent?.venue || "N/A"}</span>
                    </div>
                  )}
                </div>
              )}

              {/* III. PARTICIPATION METRICS */}
              {options.participationMetrics && (
                <div className="paper-section">
                  <h3 className="paper-section-title">III. PARTICIPATION METRICS</h3>
                  {options.metricRegistrations && (
                    <div className="text-data-row">
                      <span className="text-label">Total Registrations:</span>
                      <span className="text-value">{totalStudents} Students</span>
                    </div>
                  )}
                  {options.metricAttendance && (
                    <div className="text-data-row">
                      <span className="text-label">Verified Attendance:</span>
                      <span className="text-value">{attendedCount} Students</span>
                    </div>
                  )}
                  {options.metricFeedback && (
                    <div className="text-data-row">
                      <span className="text-label">Feedback Collected:</span>
                      <span className="text-value">{feedbackCount} Responses</span>
                    </div>
                  )}
                </div>
              )}

              {/* SIGNATURE AREA */}
              {options.signature && (
                <div className="signature-container">
                  <div className="sig-block">
                    <div className="sig-line"></div>
                    <p className="sig-text">Club Coordinator</p>
                  </div>
                  <div className="sig-block">
                    <div className="sig-line"></div>
                    <p className="sig-text">Faculty In-Charge</p>
                  </div>
                </div>
              )}
            </section>

            <footer className="paper-footer">
              <p>Report Generated On: {new Date().toLocaleDateString()}</p>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminReport;