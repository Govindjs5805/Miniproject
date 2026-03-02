import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";

function AdminFeedbacks() {
  const { clubId } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch events organized by this club
  useEffect(() => {
    const fetchEvents = async () => {
      const q = query(collection(db, "events"), where("clubId", "==", clubId));
      const snap = await getDocs(q);
      setEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    if (clubId) fetchEvents();
  }, [clubId]);

  // 2. Fetch feedbacks when an event is selected
  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!selectedEvent) {
        setFeedbacks([]);
        return;
      }
      setLoading(true);
      const q = query(collection(db, "feedbacks"), where("eventId", "==", selectedEvent));
      const snap = await getDocs(q);
      setFeedbacks(snap.docs.map(doc => doc.data()));
      setLoading(false);
    };
    fetchFeedbacks();
  }, [selectedEvent]);

  return (
    <AdminLayout>
      <div style={{ padding: "20px" }}>
        <h2>Event Feedbacks</h2>
        <p>Select an event to see what students are saying.</p>

        <select 
          onChange={(e) => setSelectedEvent(e.target.value)} 
          style={{ padding: "12px", width: "100%", maxWidth: "400px", borderRadius: "8px", margin: "20px 0" }}
        >
          <option value="">-- Choose an Event --</option>
          {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
        </select>

        <div style={{ display: "grid", gap: "20px", marginTop: "10px" }}>
          {loading ? (
            <p>Loading feedbacks...</p>
          ) : feedbacks.length > 0 ? (
            feedbacks.map((f, i) => (
              <div key={i} style={{ 
                background: "white", 
                padding: "20px", 
                borderRadius: "12px", 
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                borderLeft: f.rating >= 4 ? "5px solid #198754" : "5px solid #ffc107"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <strong>{f.userName}</strong>
                  <span style={{ color: "#ffc107" }}>{"⭐".repeat(f.rating)}</span>
                </div>
                <p style={{ color: "#444", lineHeight: "1.5", fontStyle: "italic" }}>"{f.comment}"</p>
                <small style={{ color: "#888" }}>
                  {f.submittedAt?.toDate().toLocaleDateString()}
                </small>
              </div>
            ))
          ) : (
            selectedEvent && <p style={{ color: "#888" }}>No feedback submitted for this event yet.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminFeedbacks;