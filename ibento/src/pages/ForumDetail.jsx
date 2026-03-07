import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Footer from "../components/Footer/Footer";
import "./ForumDetail.css";

function ForumDetail() {
  const { forumId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("info");
  const [forumEvents, setForumEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fixedForumId = forumId?.toLowerCase() === "mlearn" ? "mulearn" : forumId?.toLowerCase();

 const forumDataMap = {
  ieee: { 
    name: "IEEE SB CEC", 
    desc: `The IEEE Student Branch of CEC is a premier technical society dedicated to advancing technology for humanity. We organize international conferences, technical workshops, and humanitarian projects to foster engineering excellence and professional growth.`, 
    icon: "/IEEE-logo-WHITE.png" 
  },
    
  iedc: { 
    name: "IEDC BOOTCAMP CEC", 
    desc: `The Innovation and Entrepreneurship Development Centre (IEDC) is the campus hub for startups and creative ideas. We provide mentorship, resources, and a platform for students to transform their innovative concepts into successful business ventures.`, 
    icon: "/IEDC WhiteSVG 1.png" 
  },
    
  foces: { 
    name: "FOCES CEC", 
    desc: `The Forum of Computer Engineering Students (FOCES) represents the technical heartbeat of the CSE department. We focus on bridging the gap between curriculum and industry through coding contests, tech talks, and specialized workshops on emerging stacks.`, 
    icon: "/FOCES White 1.png" 
  },
    
  mulearn: { 
    name: "MuLearn CHN", 
    desc: `µLearn CHN is a vibrant regional chapter of the GTech µLearn ecosystem, dedicated to peer-to-peer learning and industry-readiness. We empower students through Interest Groups (IGs), micro-skilling, and direct mentorship from industry experts.`, 
    icon: "/Mulearn Logo.png" 
  },
    
  tinkerhub: { 
    name: "TinkerHub CEC", 
    desc: `TinkerHub is a community of makers and innovators who believe in "learning by doing." We promote open-source culture and help students master modern technology stacks through hands-on hackathons and collaborative project building.`, 
    icon: "/tinkerhub.png" 
  },
    
  proddec: { 
    name: "Proddec CEC", 
    desc: `The Product Design and Development Centre (PRODDEC) focuses on the intersection of engineering and product management. We guide students through the entire lifecycle of a product, from initial design and prototyping to final manufacturing.`, 
    icon: "/Group 13.png" 
  },
    
  gdg: { 
    name: "GDG On Campus", 
    desc: `Google Developer Groups (GDG) provide a space for students to explore Google's developer tools and technologies. We host Study Jams, Cloud campaigns, and DevFests to connect our students with the global developer community.`, 
    icon: "/gdg.png" 
  },
};
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

  const currentClub = forumDataMap[fixedForumId] || { name: fixedForumId?.toUpperCase(), desc: "Community Details" };

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
            <p>{currentClub.desc}</p>
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