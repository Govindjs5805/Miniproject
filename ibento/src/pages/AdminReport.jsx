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
      const fQuery = query(collection(db, "feedbacks"), where("eventId", "==", eventId));
      const fSnap = await getDocs(fQuery);
      setFeedbacks(fSnap.docs.map(doc => doc.data()));

      const rQuery = query(collection(db, "registrations"), where("eventId", "==", eventId));
      const rSnap = await getDocs(rQuery);
      setRegCount(rSnap.size);
    } catch (err) {
      console.error("Error fetching report metrics:", err);
    }
  };

  const generateSummary = () => {
    if (!selectedEvent) return "";
    return `The event "${selectedEvent.title}" was successfully conducted by ${clubName || "the organizer"} on ${selectedEvent.date} at ${selectedEvent.venue}. 
    A total of ${regCount} students registered for the program, indicating a strong interest in the subject matter. 
    Following the session, ${feedbacks.length} participants submitted formal feedback. 
    The event concluded effectively, meeting all planned administrative and engagement benchmarks.`;
  };

  return (
    <AdminLayout>
      <div className="report-page-container">
        <div className="report-controls no-print">
          <h2 className="dash-welcome">Post-Event Reporting</h2>
          <div className="controls-flex">
            <select onChange={handleSelectEvent} className="report-select">
              <option value="">-- Select Completed Event --</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
            {selectedEvent && (
              <button onClick={() => window.print()} className="print-btn">
                Download PDF Report
              </button>
            )}
          </div>
        </div>

        {selectedEvent && (
          <div className="printable-report-area">
            <header className="report-header">
              <h2>{clubName?.toUpperCase() || "MULEARN CHN"}</h2>
              <p className="doc-type">OFFICIAL EVENT COMPLETION RECORD</p>
              <div className="header-line"></div>
            </header>

            <section className="report-section">
              <h3 className="section-title">I. EXECUTIVE SUMMARY</h3>
              <p className="summary-paragraph">{generateSummary()}</p>
            </section>

            <section className="report-section">
              <h3 className="section-title">II. EVENT DETAILS</h3>
              <div className="metrics-list">
                <div className="metric-item">
                  <span className="metric-label">Event Title:</span>
                  <span className="metric-value">{selectedEvent.title}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Organized Date:</span>
                  <span className="metric-value">{selectedEvent.date}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Venue Location:</span>
                  <span className="metric-value">{selectedEvent.venue}</span>
                </div>
              </div>
            </section>

            <section className="report-section">
              <h3 className="section-title">III. PARTICIPATION METRICS</h3>
              <div className="metrics-list">
                <div className="metric-item">
                  <span className="metric-label">Total Registrations:</span>
                  <span className="metric-value">{regCount} Students</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Feedback Collected:</span>
                  <span className="metric-value">{feedbacks.length} Responses</span>
                </div>
              </div>
            </section>

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
            </footer>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminReport;