import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Events.css";

function Events() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snap = await getDocs(collection(db, "events"));
        const eventList = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventList);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // 🔹 Register Function
  const handleRegister = async (event) => {
    if (!user) {
      alert("Please login to register.");
      navigate("/login");
      return;
    }

    try {
      // ✅ Prevent duplicate registration
      const q = query(
        collection(db, "registrations"),
        where("eventId", "==", event.id),
        where("userId", "==", user.uid)
      );

      const existing = await getDocs(q);

      if (!existing.empty) {
        alert("You have already registered for this event.");
        return;
      }

      // ✅ Add registration safely (NO undefined fields)
      await addDoc(collection(db, "registrations"), {
        eventId: event.id,
        eventTitle: event.title || "Untitled Event",
        eventDate: event.date || "",
        userId: user.uid,
        userName: userData?.fullName || "Student",
        userEmail: user.email,
        userRole: userData?.role || "student",
        checkInStatus: false,
        checkInTime: null,
        registeredAt: new Date()
      });

      alert("Successfully registered!");

    } catch (error) {
      console.error("Registration Error:", error);
      alert("Error registering for event.");
    }
  };

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading events...</div>;
  }

  return (
    <div className="events-container">
      <h2>All Events</h2>

      <div className="events-grid">
        {events.map(event => (
          <div
           key={event.id} 
           className="event-card"
           onClick={() => navigate(`/events/${event.id}`)}
           style={{cursor: "pointer"}}
           >

            {event.posterURL && (
              <img
                src={event.posterURL}
                alt={event.title}
                className="event-poster"
              />
            )}

            <div className="event-content">
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
              <p>{event.description}</p>

              {userData?.role === "student" && (
                <button
                  type="button"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  Register
                </button>
              )}

              {!user && (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                >
                  Login to Register
                </button>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;