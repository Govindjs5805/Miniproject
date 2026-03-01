import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./StudentDashboard.css";


function StudentDashboard() {
  const { user,fullName } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMyEvents = async () => {
      try {
        const q = query(
          collection(db, "registrations"),
          where("userId", "==", user.uid)
        );

        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));

        setMyEvents(list);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [user]);

  if (loading) {
    return <p style={{ padding: "40px" }}>Loading your events...</p>;
  }

  return (
    <div style={{ padding: "40px" }}>
    <h1>Welcome, {fullName || "Student"} 👋</h1>
    <p>Here are the events you have registered for</p>


      {myEvents.length === 0 ? (
        <p>You have not registered for any events yet.</p>
      ) : (
        <table
          style={{
            marginTop: "30px",
            width: "100%",
            borderCollapse: "collapse"
          }}
          border="1"
        >
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Status</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {myEvents.map(ev => (
              <tr key={ev.id}>
                <td>{ev.eventTitle}</td>
                <td>{ev.eventDate}</td>
                <td>{ev.venue || "—"}</td>
                <td>{ev.status}</td>
                <td>
                  {ev.checkInStatus ? "Present" : "Not Checked-in"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentDashboard;
