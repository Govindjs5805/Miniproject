import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Footer from "../components/Footer/Footer";
import "./ForumDetail.css";

function ForumDetail() {
  // Destructure forumId to match the path="/forum/:forumId" in App.jsx
  const { forumId } = useParams(); 
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("info");
  const [forumEvents, setForumEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Image Mapping: Matches the URL param to your actual assets
  const logoMap = {
    foces: "/FOCES White 1.png",
    iedc: "/IEDC WhiteSVG 1.png",
    ieee: "/IEEE-logo-WHITE.png",
    mulearn: "/Mulearn Logo.png",
    tinkerhub: "/tinkerhub.png",
    proddec: "/Group 13.png",
    gdg: "/gdg.png"
  };

  // 2. Info Content Mapping
  const forumInfo = {
    ieee: "IEEE is the world's largest technical professional organization dedicated to advancing technology for the benefit of humanity.",
    iedc: "Innovation and Entrepreneurship Development Cell (IEDC) is an initiative to promote the spirit of entrepreneurship among students.",
    mulearn: "µLearn is a platform for students to learn, share, and grow together through peer-to-peer learning and industry connects.",
    gdg: "Google Developer Groups are for developers who are interested in Google's developer technologies.",
    foces: "Forum of Computer Engineering Students focuses on technical excellence and community building within the CS department.",
    tinkerhub: "TinkerHub is a community of tech enthusiasts aimed at creating a peer learning culture among students.",
    proddec: "Product Design and Development Centre focuses on hardware innovation and engineering excellence."
  };

  useEffect(() => {
    const fetchForumEvents = async () => {
      if (!forumId) return;
      
      setLoading(true);
      try {
        const eventsRef = collection(db, "events");
        // We query Firestore using the Uppercase version (e.g., "IEEE")
        const q = query(eventsRef, where("organizer", "==", forumId.toUpperCase()));
        const snap = await getDocs(q);
        
        const list = snap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        setForumEvents(list);
      } catch (error) {
        console.error("Error fetching forum events:", error);
      }
      setLoading(false);
    };

    fetchForumEvents();
    window.scrollTo(0, 0);
  }, [forumId]);

  // Guard clause to prevent crash if forumId is undefined
  if (!forumId) {
    return (
      <div className="error-container">
        <h2>Forum not found</h2>
        <button onClick={() => navigate("/home")}>Return Home</button>
      </div>
    );
  }

  return (
    <div className="forum-detail-page">
      {/* Header Section */}
      <header className="forum-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="forum-hero">
          <div className="forum-logo-large">
            <img 
              src={logoMap[forumId.toLowerCase()] || "/default-logo.png"} 
              alt={forumId} 
              onError={(e) => e.target.src = "/IEEE-logo-WHITE.png"} 
            />
          </div>
          <h1 className="forum-title">{forumId.toUpperCase()}</h1>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="forum-tabs">
        <button 
          className={`tab-btn ${activeTab === "info" ? "active" : ""}`} 
          onClick={() => setActiveTab("info")}
        >
          Information
        </button>
        <button 
          className={`tab-btn ${activeTab === "events" ? "active" : ""}`} 
          onClick={() => setActiveTab("events")}
        >
          Events ({forumEvents.length})
        </button>
      </div>

      {/* Content Section */}
      <main className="forum-content-container">
        {activeTab === "info" ? (
          <div className="info-glass-card animate-fade">
            <h3>About the Community</h3>
            <p>
              {forumInfo[forumId.toLowerCase()] || 
              "Information is currently being updated for this campus community. Stay tuned!"}
            </p>
            <div className="forum-stats">
              <div className="stat-item">
                <span>Status</span>
                <strong>Active</strong>
              </div>
              <div className="stat-item">
                <span>Category</span>
                <strong>Technical Hub</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="forum-events-grid animate-fade">
            {loading ? (
              <p className="loading-text">Loading events...</p>
            ) : forumEvents.length > 0 ? (
              forumEvents.map(event => (
                <div 
                  className="modern-event-card" 
                  key={event.id} 
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <div className="event-img-container">
                    <img src={event.posterURL} alt={event.title} />
                  </div>
                  <div className="modern-card-info">
                    <h3>{event.title}</h3>
                    <button className="modern-view-btn">View Event</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-events-box">
                <p className="no-events">No upcoming events scheduled for {forumId.toUpperCase()}.</p>
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