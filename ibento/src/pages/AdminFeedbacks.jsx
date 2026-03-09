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

  useEffect(() => {
    const fetchEvents = async () => {
      const q = query(collection(db, "events"), where("clubId", "==", clubId));
      const snap = await getDocs(q);
      setEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    if (clubId) fetchEvents();
  }, [clubId]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!selectedEvent) {
        setFeedbacks([]);
        return;
      }
      setLoading(true);
      try {
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
      <div style={{ padding: "40px", background: "#0a0a0c", minHeight: "100vh", color: "#fff", fontFamily: "Inter, sans-serif" }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "10px", background: "linear-gradient(90deg, #a78bfa, #f8fafc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Event Feedbacks
        </h2>
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>Detailed responses from participants.</p>

        <select 
          onChange={(e) => setSelectedEvent(e.target.value)} 
          style={{ 
            padding: "15px", width: "100%", maxWidth: "450px", borderRadius: "12px", 
            background: "rgba(255,255,255,0.05)", color: "#fff", 
            border: "1px solid rgba(255,255,255,0.1)", marginBottom: "40px", outline: "none"
          }}
        >
          <option value="" style={{background: "#111"}}>-- Choose an Event --</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id} style={{background: "#111"}}>{ev.title}</option>
          ))}
        </select>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "25px" }}>
          {loading ? (
            <p style={{ color: "#a78bfa" }}>Loading feedbacks...</p>
          ) : feedbacks.length > 0 ? (
            feedbacks.map((f, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", padding: "25px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ marginBottom: "15px" }}>
                  <strong style={{ fontSize: "1.2rem", color: "#a78bfa" }}>{f.userName || "Student"}</strong>
                  <br />
                </div>

                <div style={{ background: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "12px" }}>
                  {f.responses && Object.keys(f.responses).length > 0 ? (
                    Object.entries(f.responses).map(([question, answer]) => (
                      <div key={question} style={{ marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px" }}>
                        <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "0 0 4px 0" }}>{question}</p>
                        <p style={{ fontSize: "1rem", color: "#f8fafc", margin: 0, fontWeight: "500" }}>
                          {typeof answer === 'number' ? "⭐".repeat(answer) : (answer || "N/A")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>No response content found.</p>
                  )}
                </div>

                <div style={{ marginTop: "15px" }}>
                  <small style={{ color: "#475569" }}>
                    Submitted: {f.submittedAt?.toDate ? f.submittedAt.toDate().toLocaleString() : "Recently"}
                  </small>
                </div>
              </div>
            ))
          ) : (
            selectedEvent && <p style={{ color: "#64748b" }}>No feedback submitted for this event yet.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminFeedbacks;