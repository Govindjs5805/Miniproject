import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";

function AdminRegistrations() {
  const { clubId } = useAuth();

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registrations, setRegistrations] = useState([]);

  // Load club events
  useEffect(() => {
    const fetchEvents = async () => {
      const q = query(
        collection(db, "events"),
        where("clubId", "==", clubId)
      );

      const snap = await getDocs(q);

      setEvents(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    };

    if (clubId) fetchEvents();
  }, [clubId]);

  // Load registrations for selected event
  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!selectedEvent) return;

      const q = query(
        collection(db, "registrations"),
        where("eventId", "==", selectedEvent)
      );

      const snap = await getDocs(q);
      const regData = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch real names from 'users' collection for each registration
      const enrichedRegs = await Promise.all(regData.map(async (reg) => {
        // If name is generic "Student" or missing, fetch from user profile
        if (!reg.userName || reg.userName === "Student") {
          try {
            const userDoc = await getDoc(doc(db, "users", reg.userId));
            if (userDoc.exists()) {
              return { 
                ...reg, 
                userName: userDoc.data().fullName || userDoc.data().name || "Student" 
              };
            }
          } catch (err) {
            console.error("Error fetching user name:", err);
          }
        }
        return reg;
      }));

      setRegistrations(enrichedRegs);
    };

    fetchRegistrations();
  }, [selectedEvent]);

  // CSV Export
  const exportCSV = () => {
  if (registrations.length === 0) {
    alert("No registrations to export.");
    return;
  }

  // 🔥 Get selected event title
  const eventObj = events.find(e => e.id === selectedEvent);
  const eventTitle = eventObj?.title || "Event";

  // Clean title (remove special characters & spaces)
  const cleanTitle = eventTitle
    .replace(/\s+/g, "_")
    .replace(/[^\w]/g, "");

  // Add current date
  const today = new Date().toISOString().split("T")[0];

  const fileName = `${cleanTitle}_Attendance_${today}.csv`;

  const headers = [
    "Name",
    "Email",
    "Registered",
    "Checked-In",
    "Check-In Time"
  ];

  const rows = registrations.map(reg => [
    reg.userName || "",
    reg.userEmail || "",
    "Yes",
    reg.checkInStatus ? "Yes" : "No",
    reg.checkInTime?.toDate
      ? reg.checkInTime.toDate().toLocaleString()
      : "-"
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <AdminLayout>
      <h2>Event Registrations</h2>

      {!selectedEvent && (
        <>
          <p>Select Event:</p>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <option value="">-- Select Event --</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </>
      )}

      {selectedEvent && (
        <>
          <button
            onClick={exportCSV}
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            Export CSV
          </button>

          <table
            width="100%"
            style={{
              borderCollapse: "collapse"
            }}
          >
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th align="left">Name</th>
                <th align="left">Email</th>
                <th align="left">Checked-In</th>
                <th align="left">Check-In Time</th>
              </tr>
            </thead>

            <tbody>
              {registrations.map(reg => (
                <tr
                  key={reg.id}
                  style={{ borderTop: "1px solid #ddd" }}
                >
                  <td>{reg.userName}</td>
                  <td>{reg.userEmail}</td>
                  <td>
                    {reg.checkInStatus ? "Yes" : "No"}
                  </td>
                  <td>
                    {reg.checkInTime?.toDate
                      ? reg.checkInTime.toDate().toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminRegistrations;