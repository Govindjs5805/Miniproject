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
  const [regCount, setRegCount] = useState(0); // New state for registration count

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
      // 1. Fetch Feedback Count
      const fQuery = query(collection(db, "feedbacks"), where("eventId", "==", eventId));
      const fSnap = await getDocs(fQuery);
      setFeedbacks(fSnap.docs.map(doc => doc.data()));

      // 2. Fetch Registration Count
      const rQuery = query(collection(db, "registrations"), where("eventId", "==", eventId));
      const rSnap = await getDocs(rQuery);
      setRegCount(rSnap.size); // .size gives the total count of documents
    } catch (err) {
      console.error("Error fetching report metrics:", err);
    }
  };

  const generateSummary = () => {
    if (!selectedEvent) return "";
    return `The event "${selectedEvent.title}" was successfully conducted by the ${clubName} on ${selectedEvent.date} at ${selectedEvent.venue}. 
    A total of ${regCount} students registered for the program, indicating a strong interest in the subject matter. 
    Following the session, ${feedbacks.length} participants submitted formal feedback. 
    The event concluded effectively, meeting all planned administrative and engagement benchmarks.`;
  };

  return (
    <AdminLayout>
      <div className="report-controls no-print">
        <h2>Post-Event Reporting</h2>
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
            <h2>{clubName.toUpperCase()}</h2>
            <p className="doc-type">OFFICIAL EVENT COMPLETION RECORD</p>
            <div className="header-line"></div>
          </header>

          <section className="report-section">
            <h4 className="section-title">I. EXECUTIVE SUMMARY</h4>
            <p className="summary-paragraph">{generateSummary()}</p>
          </section>

          <section className="report-section">
            <h4 className="section-title">II. EVENT LOGISTICS</h4>
            <table className="report-table">
              <tbody>
                <tr>
                  <td className="label">Event Title</td>
                  <td>{selectedEvent.title}</td>
                </tr>
                <tr>
                  <td className="label">Organized Date</td>
                  <td>{selectedEvent.date}</td>
                </tr>
                <tr>
                  <td className="label">Venue Location</td>
                  <td>{selectedEvent.venue}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="report-section">
            <h4 className="section-title">III. PARTICIPATION METRICS</h4>
            <table className="report-table">
              <tbody>
                <tr>
                  <td className="label">Total Registered Attendees</td>
                  <td>{regCount} Students</td>
                </tr>
                <tr>
                  <td className="label">Feedback Responses Collected</td>
                  <td>{feedbacks.length} Participants</td>
                </tr>
                <tr>
                  <td className="label">Maximum Capacity (Seat Limit)</td>
                  <td>{selectedEvent.seatLimit || "N/A"}</td>
                </tr>
              </tbody>
            </table>
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
            <p className="generated-on">Generated on: {new Date().toLocaleDateString()}</p>
          </footer>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminReport;