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
import { useNavigate } from "react-router-dom";

function MyEvents() {
  const { user, fullName } = useAuth();
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMyEvents = async () => {
      if (!user) return;

      const q = query(
        collection(db, "registrations"),
        where("userId", "==", user.uid)
      );

      const regSnap = await getDocs(q);
      const enriched = [];

      for (const regDoc of regSnap.docs) {
        const reg = regDoc.data();
        const eventSnap = await getDoc(doc(db, "events", reg.eventId));

        if (eventSnap.exists()) {
          enriched.push({
            id: regDoc.id,
            ...reg,
            event: eventSnap.data()
          });
        }
      }

      setItems(enriched);
    };

    loadMyEvents();
  }, [user]);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Welcome, {fullName}</h2>
      <p>Here are your registered events</p>

      <table width="100%" style={{ marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Event</th>
            <th align="left">Date</th>
            <th align="left">Venue</th>
            <th align="left">Status</th>
            <th align="left">Ticket</th>
          </tr>
        </thead>

        <tbody>
          {items.map(item => (
            <tr key={item.id} style={{ borderTop: "1px solid #ccc" }}>
              <td>{item.event.title}</td>
              <td>{item.event.date}</td>
              <td>{item.event.venue}</td>
              <td>
                {item.checkInStatus ? "Checked-in ✅" : "Not Checked-in"}
              </td>
              <td>
                <button
                  onClick={() => navigate(`/ticket/${item.id}`)}
                >
                  View Ticket
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyEvents;