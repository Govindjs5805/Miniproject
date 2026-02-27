import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Hero from "../components/Home/Hero";
import CurvedLoop from "./CurvedLoop"; // Ensure path matches where you saved the component
import "./Home.css"; 

function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));
      const eventList = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by date and take up to 8 events to enable scrolling
      eventList.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(eventList.slice(0, 8));
    };
    fetchEvents();
  }, []);

  return (
    <div className="home-page-layout">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. NEW READY-MADE COMPONENT: CURVED LOOP */}
      {/* Positioned as a transition between Hero and Content */}
      <div className="marquee-divider">
        <CurvedLoop 
          marqueeText="✦ EXPLORE EVENTS ✦ JOIN COMMUNITIES ✦ CREATE MEMORIES ✦ IBENTO 2026 ✦"
          speed={2}
          curveAmount={0} 
          interactive={true}
          className="marquee-text-style"
        />
      </div>

      {/* 3. UPCOMING EVENTS (SCROLL TYPE) */}
      <section className="home-section">
        <h2 className="section-title">Upcoming Events</h2>
        <div className="events-grid">
          {events.length > 0 ? (
            events.map(event => (
              <div 
                className="event-card" 
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
              >
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
            ))
          ) : (
            <p style={{ color: '#a1a1aa', textAlign: 'center', width: '100%' }}>Loading events...</p>
          )}
        </div>
      </section>

      {/* 4. ORGANIZERS SECTION */}
      <section className="home-section">
        <h2 className="section-title">Meet the Organizers</h2>
        <div className="organizers-grid">
          <div className="org-card">
            <div className="org-avatar">👑</div>
            <h4>Alex Rivera</h4>
            <p>Lead Coordinator</p>
          </div>
          <div className="org-card">
            <div className="org-avatar">💻</div>
            <h4>Tech Team</h4>
            <p>System Architects</p>
          </div>
          <div className="org-card">
            <div className="org-avatar">✨</div>
            <h4>Events Team</h4>
            <p>Experience Leads</p>
          </div>
        </div>
      </section>

      {/* 5. FEEDBACK SECTION */}
      <section className="home-section">
        <h2 className="section-title">What Students Say</h2>
        <div className="feedback-container">
          <div className="glass-card feedback-card">
            <p>"IBENTO turned our messy campus WhatsApp groups into a professional event hub."</p>
            <span className="user-tag">- Jordan, Tech Lead</span>
          </div>
          <div className="glass-card feedback-card">
            <p>"Finally a platform where I can track my event registrations and tickets in one place."</p>
            <span className="user-tag">- Maya, Design Head</span>
          </div>
        </div>
      </section>

      {/* 6. FOOTER CTA SECTION */}
      <footer className="footer-cta">
        <div className="cta-glass-box">
          <h2>Join the Ibento Community</h2>
          <p>The smartest way to stay connected with your campus events.</p>
          <div className="cta-btns">
            <button className="primary-btn" onClick={() => navigate("/register")}>Get Started Now</button>
          </div>
        </div>
        <p className="copyright">© 2026 IBENTO. Empowering Campus Life.</p>
      </footer>
    </div>
  );
}

export default Home;