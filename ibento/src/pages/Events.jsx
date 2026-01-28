import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);

  const { user } = useAuth();

  // 🔹 Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const eventsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // 🔹 Register for event
  const handleRegister = async (event) => {
    if (!user) {
      alert("Please login to register for events");
      return;
    }

    setRegisteringId(event.id);

    try {
      // 🔍 Prevent duplicate registration
      const q = query(
        collection(db, "registrations"),
        where("eventId", "==", event.id),
        where("userId", "==", user.uid)
      );

      const existing = await getDocs(q);
      if (!existing.empty) {
        alert("You have already registered for this event");
        setRegisteringId(null);
        return;
      }

      // ✅ Save registration
      await addDoc(collection(db, "registrations"), {
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        userId: user.uid,
        userEmail: user.email,
        userRole: "student",
        status: "registered",
        registeredAt: new Date(),
        checkInStatus: false,
        checkInTime: null,
      });

      alert("Successfully registered!");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message);
    } finally {
      setRegisteringId(null);
    }
  };

  if (loading) {
    return <p style={{ padding: "40px" }}>Loading events...</p>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>All Events</h1>
      <p>Browse and register for upcoming campus events</p>

      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <h3>{event.title}</h3>
              <p>
                <strong>Date:</strong> {event.date}
              </p>
              <p>
                <strong>Category:</strong> {event.category}
              </p>
              <p>
                <strong>Venue:</strong> {event.venue}
              </p>

              <button
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "8px",
                }}
                onClick={() => handleRegister(event)}
                disabled={registeringId === event.id}
              >
                {registeringId === event.id ? "Registering..." : "Register"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
