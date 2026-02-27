import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Hero from "../components/Home/Hero";
import CurvedLoop from "./CurvedLoop"; 
import "./Home.css"; 

function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  // DEFINE YOUR 9 DIFFERENT LOGO PATHS HERE
  const forumLogos = [
    "/logo1.png",
    "/logo2.png",
    "/logo3.png",
    "/logo4.png",
    "/logo5.png",
    "/logo6.png",
    "/logo7.png",
    "/logo8.png",
    "/logo9.png"
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));
      const eventList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      eventList.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(eventList.slice(0, 8));
    };
    fetchEvents();
  }, []);

  return (
    <div className="home-page-layout">
      <Hero />

      {/* Pass the array of logos to the component */}
      <CurvedLoop 
        logos={forumLogos} 
        speed={0.4} 
        curveAmount={160} 
        logoSize={80} 
      />

      <section className="home-section">
        <h2 className="section-title">Upcoming Events</h2>
        <div className="events-grid">
          {events.map(event => (
            <div className="event-card" key={event.id} onClick={() => navigate(`/events/${event.id}`)}>
               <div className="card-image">
                  <img src={event.posterURL || "https://via.placeholder.com/400x600"} alt={event.title} />
                  <div className="event-badge">
                    {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "TBA"}
                  </div>
                </div>
                <div className="card-content">
                  <h3>{event.title}</h3>
                  <p className="event-loc">📍 {event.location || "Campus Hub"}</p>
                  <p className="event-desc">{event.description?.slice(0, 60)}...</p>
                  <button className="glass-btn-sm">View Details</button>
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rest of your sections... */}
    </div>
  );
}

export default Home;