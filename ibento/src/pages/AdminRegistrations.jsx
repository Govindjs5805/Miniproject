import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebase";

function AdminRegistrations() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setEvents(list);
    };
    fetchEvents();
  }, []);

  // Fetch registrations for selected event
  const fetchRegistrations = async (eventId) => {
    setLoading(true);
    const q = query(
      collection(db, "registrations"),
      where("eventId", "==", eventId)
    );
    const snap = await getDocs(q);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setRegistrations(list);
    setLoading(false);
  };

  // Mark attendance
  const markAttendance = async (registrationId) => {
    const ref = doc(db, "registrations", registrationId);
    await updateDoc(ref, {
      checkInStatus: true,
      checkInTime: new Date()
    });
    fetchRegistrations(selectedEventId);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin – Event Registrations</h2>

      {/* Event selector */}
      <select
        style={{ padding: "10px", marginTop: "20px", width: "300px" }}
        value={selectedEventId}
        onChange={(e) => {
          setSelectedEventId(e.target.value);
          fetchRegistrations(e.target.value);
        }}
      >
        <option value="">Select Event</option>
        {events.map(ev => (
          <option key={ev.id} value={ev.id}>
            {ev.title}
          </option>
        ))}
      </select>

      {/* Registrations list */}
      {loading && <p>Loading registrations...</p>}

      {!loading && registrations.length > 0 && (
        <table
          border="1"
          cellPadding="10"
          style={{ marginTop: "30px", width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Check-in</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(reg => (
              <tr key={reg.id}>
                <td>{reg.userEmail}</td>
                <td>{reg.status}</td>
                <td>{reg.checkInStatus ? "Present" : "Not Checked-in"}</td>
                <td>
                  {!reg.checkInStatus && (
                    <button onClick={() => markAttendance(reg.id)}>
                      Mark Present
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && selectedEventId && registrations.length === 0 && (
        <p style={{ marginTop: "20px" }}>No registrations for this event.</p>
      )}
    </div>
  );
}

export default AdminRegistrations;
