import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";
import "./AdminReport.css";

function AdminReport() {
  const { clubId, clubName } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [regCount, setRegCount] = useState(0);
  const [attendedCount, setAttendedCount] = useState(0);

  // Dynamic configuration options (Matched with SuperAdmin)
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
    signatureSection: true,
  });

  const handleCheckboxChange = (e) => {
    setOptions({ ...options, [e.target.name]: e.target.checked });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), where("clubId", "==", clubId));
        const snap = await getDocs(q);
        setEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    if (clubId) fetchEvents();
  }, [clubId]);

  const handleSelectEvent = async (e) => {
    const eventId = e.target.value;
    if (!eventId) {
      setSelectedEvent(null);
      return;
    }

    const event = events.find(ev => ev.id === eventId);
    setSelectedEvent(event);

    try {
      // Fetch Feedback
      const fQuery = query(collection(db, "feedbacks"), where("eventId", "==", eventId));
      const fSnap = await getDocs(fQuery);
      setFeedbacks(fSnap.docs.map(doc => doc.data()));

      // Fetch Registrations & Attendance
      const rQuery = query(collection(db, "registrations"), where("eventId", "==", eventId));
      const rSnap = await getDocs(rQuery);
      const regs = rSnap.docs.map(doc => doc.data());
      
      setRegCount(rSnap.size);
      setAttendedCount(regs.filter(r => r.attended === true || r.status === "attended").length);
    } catch (err) {
      console.error("Error fetching report metrics:", err);
    }
  };

  const generateSummary = () => {
    if (!selectedEvent) return "";
    return `The event "${selectedEvent.title}" was successfully conducted by ${clubName || "the organizer"} on ${selectedEvent.date || "N/A"} at ${selectedEvent.venue || "the designated venue"}. 
    Based on administrative records, ${regCount} students registered for the program. 
    Attendance was verified for ${attendedCount} participants, and ${feedbacks.length} formal feedbacks were collected. 
    The event concluded effectively, meeting all planned administrative and engagement benchmarks.`;
  };

  return (
    <AdminLayout>
      <div className="report-page-container">
        {/* DASHBOARD CONTROLS */}
        <div className="report-controls no-print">
          <h2 className="dash-welcome">Report Configuration</h2>
          
          <div className="config-section">
            <label className="config-step-label">1. Select Event</label>
            <select onChange={handleSelectEvent} className="report-select">
              <option value="">-- Choose Event --</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
          </div>

          {selectedEvent && (
            <div className="config-section fade-in">
              <label className="config-step-label">2. Select Information to Display</label>
              <div className="options-grid-selection">
                {Object.keys(options).map((key) => (
                  <label key={key} className="checkbox-label-item">
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
              <button onClick={() => window.print()} className="print-btn-main">
                Generate Official PDF
              </button>
            </div>
          )}
        </div>

        {/* OFFICIAL PRINTABLE REPORT */}
        {selectedEvent && (
          <div className="printable-report-area" id="printable-report">
            <header className="report-header">
              <h2>{clubName?.toUpperCase() || "ORGANIZING BODY"}</h2>
              <p className="doc-type">OFFICIAL EVENT COMPLETION RECORD</p>
              <div className="header-line"></div>
            </header>

            {options.executiveSummary && (
              <section className="report-section">
                <h3 className="section-title">I. EXECUTIVE SUMMARY</h3>
                <p className="summary-paragraph">{generateSummary()}</p>
              </section>
            )}

            {options.eventDetails && (
              <section className="report-section">
                <h3 className="section-title">II. EVENT DETAILS</h3>
                <div className="report-table">
                  {options.detailTitle && (
                    <div className="table-row">
                      <span className="table-label">Event Title:</span>
                      <span className="table-value">{selectedEvent.title}</span>
                    </div>
                  )}
                  {options.detailDate && (
                    <div className="table-row">
                      <span className="table-label">Organized Date:</span>
                      <span className="table-value">{selectedEvent.date}</span>
                    </div>
                  )}
                  {options.detailVenue && (
                    <div className="table-row">
                      <span className="table-label">Venue Location:</span>
                      <span className="table-value">{selectedEvent.venue}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {options.participationMetrics && (
              <section className="report-section">
                <h3 className="section-title">III. PARTICIPATION METRICS</h3>
                <div className="report-table">
                  {options.metricRegistrations && (
                    <div className="table-row">
                      <span className="table-label">Total Registrations:</span>
                      <span className="table-value">{regCount} Students</span>
                    </div>
                  )}
                  {options.metricAttendance && (
                    <div className="table-row">
                      <span className="table-label">Verified Attendance:</span>
                      <span className="table-value">{attendedCount} Students</span>
                    </div>
                  )}
                  {options.metricFeedback && (
                    <div className="table-row">
                      <span className="table-label">Feedback Collected:</span>
                      <span className="table-value">{feedbacks.length} Responses</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {options.signatureSection && (
              <footer className="report-footer">
                <div className="sig-container">
                  <div className="sig-box">
                    <div className="sig-line"></div>
                    <p>Club Coordinator</p>
                  </div>
                  <div className="sig-box">
                    <div className="sig-line"></div>
                    <p>Faculty In-Charge</p>
                  </div>
                </div>
                <p className="generated-on-text">Report Generated On: {new Date().toLocaleDateString()}</p>
              </footer>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminReport;