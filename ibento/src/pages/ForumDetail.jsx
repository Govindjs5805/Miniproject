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

  // Fix alias: mlearn → mulearn
  const fixedForumId =
    forumId?.toLowerCase() === "mlearn"
      ? "mulearn"
      : forumId?.toLowerCase();

  const forumDataMap = {
    ieee: {
      name: "IEEE Student Branch CEC",
      desc: "Tech forum focusing on engineering excellence."
    },
    iedc: {
      name: "IEDC Bootcamp CEC",
      desc: "Promoting entrepreneurship among students."
    },
    foces: {
      name: "FOCES CEC",
      desc: "Forum of Computer Engineering students."
    },
    mulearn: {
      name: "MuLearn CHN",
      desc: "Peer-to-peer learning network for industry skills."
    }
  };

  useEffect(() => {
    const fetchForumEvents = async () => {
      if (!forumId) return;

      setLoading(true);

      try {
        const querySnapshot = await getDocs(collection(db, "events"));

        const allEvents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const filteredEvents = allEvents.filter(
          event => event.clubId?.toLowerCase() === fixedForumId
        );

        setForumEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }

      setLoading(false);
    };

    fetchForumEvents();
  }, [forumId, fixedForumId]);

  const currentClub =
    forumDataMap[fixedForumId] || {
      name: fixedForumId?.toUpperCase(),
      desc: "Community Details"
    };

  return (
    <div className="forum-detail-page">

      {/* HEADER */}
      <header className="forum-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="forum-hero">
          <h1 className="forum-title">{currentClub.name}</h1>
        </div>
      </header>

      {/* TABS */}
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
          Upcoming Events ({forumEvents.length})
        </button>

      </div>

      {/* CONTENT */}
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

                <div
                  key={event.id}
                  className="modern-event-card"
                  onClick={() => navigate(`/events/${event.id}`)}
                >

                  <div className="event-img-container">
                    <img
                      src={event.posterURL || event.image}
                      alt={event.title}
                    />
                  </div>

                  <div className="modern-card-info">
                    <h3>{event.title}</h3>
                    <p>Date: {event.date}</p>
                  </div>

                </div>

              ))

            ) : (

              <p className="no-events">
                No upcoming events found for {currentClub.name}.
              </p>

            )}

          </div>

        )}

      </main>

    </div>
  );
}

export default ForumDetail;