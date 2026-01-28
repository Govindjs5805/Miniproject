import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "../firebase";

function AdminEventReport() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [report, setReport] = useState("");

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchEvents();
  }, []);

  // Generate report
  const generateReport = async (event) => {
    setSelectedEvent(event);

    const q = query(
      collection(db, "registrations"),
      where("eventId", "==", event.id)
    );

    const snap = await getDocs(q);
    const regs = snap.docs.map(d => d.data());
    setRegistrations(regs);

    const total = regs.length;
    const present = regs.filter(r => r.checkInStatus).length;
    const absent = total - present;

    const summary = `
Event Report: ${event.title}

Total Registrations: ${total}
Students Attended: ${present}
Students Absent: ${absent}

Summary:
The event "${event.title}" was successfully conducted on ${event.date} at ${event.venue}. 
Out of ${total} registered participants, ${present} students actively attended the event.
The overall participation and engagement were satisfactory, making the event a success.
`;

    setReport(summary);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin – Event Report Generation</h2>

      <select
        style={{ padding: "10px", marginTop: "20px", width: "300px" }}
        onChange={(e) => {
          const ev = events.find(x => x.id === e.target.value);
          if (ev) generateReport(ev);
        }}
      >
        <option value="">Select Event</option>
        {events.map(ev => (
          <option key={ev.id} value={ev.id}>
            {ev.title}
          </option>
        ))}
      </select>

      {report && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ccc",
            whiteSpace: "pre-line"
          }}
        >
          <h3>Generated Report</h3>
          <p>{report}</p>
        </div>
      )}
    </div>
  );
}

export default AdminEventReport;
