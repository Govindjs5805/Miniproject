import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
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
      // Assuming events have a clubId field
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
      try {
        // Correct collection name: "feedbacks"
        const q = query(
          collection(db, "feedbacks"), 
          where("eventId", "==", selectedEvent)
        );
        const snap = await getDocs(q);
        setFeedbacks(snap.docs.map(doc => doc.data()));
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [selectedEvent]);

  return (
    <AdminLayout>
      <div style={{ 
        padding: "40px", 
        background: "#0a0a0c", 
        minHeight: "100vh", 
        color: "#fff",
        fontFamily: "Inter, sans-serif" 
      }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "10px", color: "#a78bfa" }}>
          Event Feedbacks
        </h2>
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>Select an event to see what students are saying.</p>

        <select 
          onChange={(e) => setSelectedEvent(e.target.value)} 
          style={{ 
            padding: "15px", 
            width: "100%", 
            maxWidth: "450px", 
            borderRadius: "12px", 
            background: "rgba(255,255,255,0.05)", 
            color: "#fff", 
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            fontSize: "1rem",
            marginBottom: "40px",
            outline: "none"
          }}
        >
          <option value="" style={{background: "#111"}}>-- Choose an Event --</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id} style={{background: "#111"}}>{ev.title}</option>
          ))}
        </select>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "25px" }}>
          {loading ? (
            <p style={{ color: "#a78bfa" }}>Loading feedbacks...</p>
          ) : feedbacks.length > 0 ? (
            feedbacks.map((f, i) => (
              <div key={i} style={{ 
                background: "rgba(255,255,255,0.03)", 
                padding: "25px", 
                borderRadius: "20px", 
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "0.3s",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{ 
                    position: "absolute", 
                    top: 0, left: 0, width: "4px", height: "100%", 
                    background: f.rating >= 4 ? "#10b981" : "#f59e0b" 
                }}></div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <strong style={{ fontSize: "1.1rem", color: "#f8fafc" }}>{f.userName}</strong>
                  <span style={{ 
                    background: "rgba(167, 139, 250, 0.1)", 
                    padding: "4px 10px", 
                    borderRadius: "50px", 
                    color: "#a78bfa", 
                    fontSize: "0.8rem",
                    fontWeight: "bold"
                  }}>
                    {"⭐".repeat(f.rating)}
                  </span>
                </div>

                <p style={{ color: "#cbd5e1", lineHeight: "1.6", fontStyle: "italic", marginBottom: "20px" }}>
                  "{f.comment}"
                </p>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "15px" }}>
                    <small style={{ color: "#64748b", display: "block" }}>
                      Submitted: {f.submittedAt?.toDate().toLocaleDateString()}
                    </small>
                    <small style={{ color: "#475569" }}>{f.userEmail}</small>
                </div>
              </div>
            ))
          ) : (
            selectedEvent && <p style={{ color: "#64748b", gridColumn: "1/-1" }}>No feedback submitted for this event yet.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminFeedbacks;