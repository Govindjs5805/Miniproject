import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore"; // Added doc and getDoc
import { db } from "../firebase";
import Footer from "../components/Footer/Footer";
import "./ForumDetail.css";

function ForumDetail() {
  const { forumId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("info");
  const [forumEvents, setForumEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveDesc, setLiveDesc] = useState(""); // State for dynamic About text

  const fixedForumId = forumId?.toLowerCase() === "mlearn" ? "mulearn" : forumId?.toLowerCase();

  const forumDataMap = {
    ieee: { name: "IEEE SB CEC", icon: "/IEEE-logo-WHITE.png" },
    iedc: { name: "IEDC BOOTCAMP CEC", icon: "/IEDC WhiteSVG 1.png" },
    foces: { name: "FOCES CEC", icon: "/FOCES White 1.png" },
    mulearn: { name: "MuLearn CHN", icon: "/Mulearn Logo.png" },
    tinkerhub: { name: "TinkerHub CEC", icon: "/tinkerhub.png" },
    proddec: { name: "Proddec CEC", icon: "/Group 13.png" },
    gdg: { name: "GDG On Campus", icon: "/gdg.png" },
  };

  // 1. Fetch Dynamic "About" Description from Firestore
  useEffect(() => {
    const fetchAboutData = async () => {
      if (!fixedForumId) return;
      try {
        const docRef = doc(db, "clubs", fixedForumId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLiveDesc(docSnap.data().description);
        } else {
          // Fallback if no admin entry exists yet
          setLiveDesc("Community Details");
        }
      } catch (err) {
        console.error("Error fetching club about:", err);
      }
    };
    fetchAboutData();
  }, [fixedForumId]);

  // 2. Fetch Events (Your existing logic)
  useEffect(() => {
    const fetchForumEvents = async () => {
      if (!forumId) return;
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const allEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filteredEvents = allEvents.filter(event => event.clubId?.toLowerCase() === fixedForumId);
        setForumEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
      setLoading(false);
    };
    fetchForumEvents();
  }, [forumId, fixedForumId]);

  const currentClub = forumDataMap[fixedForumId] || { name: fixedForumId?.toUpperCase() };

  return (
    <div className="forum-detail-page">
      <header className="forum-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="forum-hero">
          {currentClub.icon && (
            <div className="forum-logo-large">
              <img src={currentClub.icon} alt={currentClub.name} className="forum-logo-img" />
            </div>
          )}
          <h1 className="forum-title">{currentClub.name}</h1>
        </div>
      </header>

      <div className="forum-tabs">
        <button className={`tab-btn ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}>Information</button>
        <button className={`tab-btn ${activeTab === "events" ? "active" : ""}`} onClick={() => setActiveTab("events")}>Upcoming Events ({forumEvents.length})</button>
      </div>

      <main className="forum-content-container">
        {activeTab === "info" ? (
          <div className="info-glass-card">
            <h3>About {currentClub.name}</h3>
            {/* DISPLAY THE DYNAMIC LIVE DESCRIPTION HERE */}
            <p>{liveDesc}</p>
          </div>
        ) : (
          <div className="forum-events-grid">
            {loading ? (
              <p>Loading events...</p>
            ) : forumEvents.length > 0 ? (
              forumEvents.map(event => (
                <div key={event.id} className="modern-event-card" onClick={() => navigate(`/events/${event.id}`)}>
                  <div className="event-img-container">
                    <img src={event.posterURL || event.image} alt={event.title} />
                  </div>
                  <div className="modern-card-info">
                    <h3>{event.title}</h3>
                    <p>Date: {event.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-events">No upcoming events found for {currentClub.name}.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default ForumDetail;