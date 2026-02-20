import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function Events() {
  const { user, role, fullName } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const eventList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventList);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  // 🔥 Handle Registration
  const handleRegister = async (event) => {
    if (!user) {
      alert("Please login to register");
      return;
    }

    try {
      // Prevent duplicate registration
      const q = query(
        collection(db, "registrations"),
        where("eventId", "==", event.id),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert("You have already registered for this event.");
        return;
      }

      await addDoc(collection(db, "registrations"), {
        eventId: event.id,
        eventTitle: event.title,
        userId: user.uid,
        userEmail: user.email,
        userName: user.email,
        clubId: event.clubId,
        checkInStatus: false,
        checkInTime: null,
        createdAt: serverTimestamp()
      });

      alert("Registered successfully!");

    } catch (error) {
      console.error("REGISTRATION ERROR:",error);
      alert(error.message);
    }
  };

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading events...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "10px" }}>All Events</h1>
      <p style={{ marginBottom: "30px" }}>
        Browse and register for upcoming campus events
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px"
      }}>
        {events.map(event => (
          <div
            key={event.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              background: "#fff"
            }}
          >
            {/* Poster */}
            {event.posterURL && (
              <img
                src={event.posterURL}
                alt={event.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "10px"
                }}
              />
            )}

            <h3>{event.title}</h3>

            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Description:</strong> {event.description}</p>

            {role === "student" && (
              <button
                onClick={() => handleRegister(event)}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  background: "#0a7f3f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Register
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;