import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Hero from "../components/Home/Hero";
import CurvedLoop from "./CurvedLoop"; 
import Footer from "../components/Footer/Footer"; 
import "./Home.css"; 

function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  const forumLogos = ["/FOCES White 1.png", "/IEDC WhiteSVG 1.png", "/IEEE-logo-WHITE.png", "/Mulearn Logo.png", "/tinkerhub.png", "/Group 13.png","/gdg.png","/IEEE-logo-WHITE.png", "/Mulearn Logo.png", "/tinkerhub.png", "/Group 13.png"];
  const forums = [
    { name: "FOCES", img: "/FOCES White 1.png" },
    { name: "IEDC", img: "/IEDC WhiteSVG 1.png" },
    { name: "IEEE", img: "/IEEE-logo-WHITE.png" },
    { name: "μLearn", img: "/Mulearn Logo.png" },
    { name: "TinkerHub", img: "/tinkerhub.png" },
    { name: "PRODDEC", img: "/Group 13.png" },
    { name: "GDG", img: "/gdg.png" }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));
      const today = new Date().setHours(0, 0, 0, 0);
      
      const eventList = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(event => new Date(event.date).getTime() >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setEvents(eventList);
    };
    fetchEvents();
  }, []);

  return (
    <div className="home-page-layout">
      {/* 1. Hero Section with Glow Blender */}
      <div className="hero-container-main">
        <Hero />
        <div className="section-blender"></div> 
      </div>

      {/* 2. Smooth Scrolling Logo Strip */}
      <div className="branding-strip">
        <CurvedLoop logos={forumLogos} speed={0.05} curveAmount={0} logoSize={90} />
      </div>

      {/* 3. Modern Events Section */}
      <section className="home-section">
        <h2 className="massive-title">Upcoming Events</h2>
        <div className="events-grid">
          {events.map(event => (
            <div className="modern-event-card" key={event.id} onClick={() => navigate(`/events/${event.id}`)}>
              <div className="event-img-container">
                <img src={event.posterURL} alt={event.title} />
                
                {/* Modern Date Badge */}
                <div className="modern-date-badge">
                  <span className="m-month">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="m-day">{new Date(event.date).getDate()}</span>
                </div>

                {/* Organizer Forum Tag */}
                <div className="organizer-tag">
                  {event.organizer || "Campus Event"}
                </div>
              </div>

              <div className="modern-card-info">
                <h3>{event.title}</h3>
                <div className="card-footer-action">
                  <button className="modern-view-btn">
                    View Details <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Communities Section */}
      <section className="organizers-section">
        <h2 className="massive-title">Our Communities</h2>
        <div className="organizers-row">
          {forums.map((forum, index) => (
            <div className="community-circle-card" key={index}>
              <div className="community-avatar">
                <img src={forum.img} alt={forum.name} />
              </div>
              <h4>{forum.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Integrated Footer */}
      <Footer />
    </div>
  );
}

export default Home;