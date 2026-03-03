import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Events.css";

function Events() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snap = await getDocs(collection(db, "events"));
        setEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading Experiences...</div>;
  }

  return (
    <div className="all-events-wrapper">
      <div className="silk-bg-overlay"></div>
      
      <header className="events-header">
        <h1 className="glitch-text">ALL EVENTS</h1>
        <p className="header-sub">Join the next big adventure</p>
      </header>

      <main className="events-grid-container">
        {events.map(event => (
          <div 
            key={event.id} 
            className="event-glass-card"
            onClick={() => navigate(`/events/${event.id}`)}
          >
            <div className="event-image-container">
              <img src={event.posterURL || "https://via.placeholder.com/300x180"} alt={event.title} className="event-img" />
              <div className="category-tag">Live</div>
            </div>

            <div className="event-details">
              <h3 className="event-title-compact">{event.title}</h3>
              
              <div className="detail-row-mini">
                <span className="icon"></span>
                <span className="text">{event.date}</span>
              </div>
              
              <div className="detail-row-mini">
                <span className="icon"></span>
                <span className="text">{event.venue}</span>
              </div>

              <button className="register-neon-btn">
                {user ? "View Details" : "Login to Join"}
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Events;