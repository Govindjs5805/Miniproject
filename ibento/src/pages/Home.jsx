import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(list.slice(0, 3));
    };

    fetchEvents();
  }, []);

  return (
    <div className="home">

      <section className="hero">
        <h1>Experience Campus Events Like Never Before</h1>
        <p>Discover. Register. Attend. Track.</p>
        <button onClick={() => navigate("/events")}>
          Explore Events
        </button>
      </section>

      <section className="preview" data-aos="fade-up">
        <h2>Upcoming Events</h2>
        <div className="preview-grid">
          {events.map(event => (
            <div key={event.id} className="preview-card">
              <img src={event.posterURL} alt="" />
              <h3>{event.title}</h3>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;