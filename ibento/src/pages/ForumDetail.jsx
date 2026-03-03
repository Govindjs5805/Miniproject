import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, or } from "firebase/firestore";
import { db } from "../firebase";
import Footer from "../components/Footer/Footer";
import "./ForumDetail.css";

function ForumDetail() {
  const { forumId } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("info");
  const [forumEvents, setForumEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fixed Logo Map: Ensure both spellings point to the same file
  const logoMap = {
    foces: "/FOCES White 1.png",
    iedc: "/IEDC WhiteSVG 1.png",
    ieee: "/IEEE-logo-WHITE.png",
    mulearn: "/Mulearn Logo.png",
    mlearn: "/Mulearn Logo.png", // Added fallback for mlearn spelling
    tinkerhub: "/tinkerhub.png",
    proddec: "/Group 13.png",
    gdg: "/gdg.png"
  };

  // 2. Fixed Info Map
  const forumInfo = {
    ieee: "IEEE is advancing technology for the benefit of humanity.",
    iedc: "IEDC promotes the spirit of entrepreneurship among students.",
    mulearn: "µLearn is a platform for peer-to-peer learning and industry connects.",
    mlearn: "µLearn is a platform for peer-to-peer learning and industry connects."
  };

  useEffect(() => {
    const fetchForumEvents = async () => {
      if (!forumId) return;
      
      setLoading(true);
      const searchId = forumId.toLowerCase().trim();
      const todayStr = new Date().toISOString().split('T')[0];

      try {
        const eventsRef = collection(db, "events");
        
        // 3. Robust Query: Check for both spellings in Firestore
        // This ensures if your URL is 'mlearn' it still finds 'mulearn' events
        const q = query(
          eventsRef, 
          or(
            where("clubId", "==", searchId),
            where("clubId", "==", "mulearn"),
            where("clubId", "==", "mlearn")
          )
        );

        const snap = await getDocs(q);
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 4. Date Filter: Ensure IEEE and others aren't hidden by weird date formats
        const upcomingEvents = list.filter(event => {
            if (!event.date) return true; 
            // If the date is 2026-10-12 (from your screenshot), this will show it!
            return event.date >= todayStr;
        });

        // Sort by date and remove duplicates
        const uniqueEvents = Array.from(new Map(upcomingEvents.map(e => [e.id, e])).values());
        setForumEvents(uniqueEvents.sort((a, b) => new Date(a.date) - new Date(b.date)));
        
      } catch (error) {
        console.error("Error fetching events:", error);
      }
      setLoading(false);
    };

    fetchForumEvents();
    window.scrollTo(0, 0);
  }, [forumId]);

  if (!forumId) return null;

  // 5. Title Fix: Force the display to be correct regardless of URL spelling
  const getDisplayTitle = () => {
    const id = forumId.toLowerCase();
    if (id === "mulearn" || id === "mlearn") return "µLEARN";
    return forumId.toUpperCase();
  };

  return (
    <div className="forum-detail-page">
      <header className="forum-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="forum-hero">
          <div className="forum-logo-large">
            <img 
              src={logoMap[forumId.toLowerCase()] || "/default-logo.png"} 
              alt={forumId} 
              onError={(e) => e.target.src = "/Mulearn Logo.png"} 
            />
          </div>
          <h1 className="forum-title">{getDisplayTitle()}</h1>
        </div>
      </header>

      <div className="forum-tabs">
        <button className={`tab-btn ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}>
          Information
        </button>
        <button className={`tab-btn ${activeTab === "events" ? "active" : ""}`} onClick={() => setActiveTab("events")}>
          Upcoming Events ({forumEvents.length})
        </button>
      </div>

      <main className="forum-content-container">
        {activeTab === "info" ? (
          <div className="info-glass-card animate-fade">
            <h3>About the Community</h3>
            <p>{forumInfo[forumId.toLowerCase()] || "Information coming soon!"}</p>
          </div>
        ) : (
          <div className="forum-events-grid animate-fade">
            {loading ? (
              <p className="loading-text">Loading...</p>
            ) : forumEvents.length > 0 ? (
              forumEvents.map(event => (
                <div className="modern-event-card" key={event.id} onClick={() => navigate(`/events/${event.id}`)}>
                  <div className="event-img-container">
                    <img src={event.posterURL || event.image} alt={event.title} />
                  </div>
                  <div className="modern-card-info">
                    <h3>{event.title}</h3>
                    <p className="event-date-small">Date: {event.date}</p>
                    <button className="modern-view-btn">View Event</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-events-box">
                <p className="no-events">No upcoming events for {getDisplayTitle()}.</p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ForumDetail;