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

  // 1. DEFINE YOUR 9 LOGOS HERE
  // These files MUST be in your /public folder
  const forumLogos = [
    "/FOCES White 1.png", 
    "/IEDC WhiteSVG 1.png", 
    "/IEEE-logo-WHITE.png", 
    "/Mulearn Logo.png",
    "/tinkerhub.png",
       "/IEDC WhiteSVG 1.png", 
     "/FOCES White 1.png", 
 "/Mulearn Logo.png",
    "/Group 13.png"
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

      {/* 2. THE CURVED LOOP WITH 9 LOGOS */}
      {/* Ensure this is NOT wrapped in a container that has padding/margins */}
      <CurvedLoop 
        logos={forumLogos} 
        speed={0.2} 
        curveAmount={0} 
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
                  <button className="glass-btn-sm">View Details</button>
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the Organizers Section */}
      <section className="home-section">
        <h2 className="section-title">Meet the Organizers</h2>
        <div className="organizers-grid">
          <div className="org-card">
            <div className="org-avatar">👑</div>
            <h4>Lead Coordinator</h4>
          </div>
          <div className="org-card">
            <div className="org-avatar">💻</div>
            <h4>Tech Team</h4>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;