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

  const forums = [
    { name: "FOCES", img: "/FOCES White 1.png" },
    { name: "IEDC", img: "/IEDC WhiteSVG 1.png" },
    { name: "IEEE", img: "/IEEE-logo-WHITE.png" },
    { name: "μLearn", img: "/Mulearn Logo.png" },
    { name: "TinkerHub", img: "/tinkerhub.png" },
    { name: "PRODDEC", img: "/Group 13.png" }
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
      {/* Hero section handles its own background, but we wrap it to ensure continuity */}
      <div className="hero-wrapper">
        <Hero />
      </div>

      <CurvedLoop 
        logos={forumLogos} 
        speed={0.05} 
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
                <button className="glass-btn-sm">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="organizers-section">
        <h2 className="section-title organizers-title">Our Communities</h2>
        <div className="organizers-grid">
          {forums.map((forum, index) => (
            <div className="org-card" key={index}>
              <div className="org-avatar">
                <img src={forum.img} alt={forum.name} />
              </div>
              <h4>{forum.name}</h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;