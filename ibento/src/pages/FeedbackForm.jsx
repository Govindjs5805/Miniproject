import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "./Feedback.css";

function FeedbackForm() {
  const { eventId } = useParams();
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  
  const [eventData, setEventData] = useState(null);
  const [responses, setResponses] = useState({}); // Stores answers dynamically
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchEventSchema = async () => {
      try {
        const eventDoc = await getDoc(doc(db, "events", eventId));
        if (eventDoc.exists()) {
          setEventData(eventDoc.data());
          // Initialize responses based on schema
          const initialResponses = {};
          const schema = eventDoc.data().feedbackSchema || [];
          schema.forEach(field => {
            initialResponses[field.label] = field.type === "rating" ? 5 : "";
          });
          setResponses(initialResponses);
        }
      } catch (err) {
        console.error("Error fetching schema:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchEventSchema();
  }, [eventId]);

  const handleInputChange = (label, value) => {
    setResponses(prev => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const feedbackRef = doc(db, "feedbacks", `${eventId}_${user.uid}`);
      await setDoc(feedbackRef, {
        eventId,
        userId: user.uid,
        userName: userData?.fullName || user.displayName || "Anonymous Student",
        userEmail: user.email,
        responses: responses, // ALL CUSTOM ANSWERS SAVED HERE
        submittedAt: serverTimestamp(),
      });

      alert("Feedback received! Thank you");
      navigate("/dashboard");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading">Loading Feedback Form...</div>;

  return (
    <div className="feedback-outer-container">
      <div className="glass-feedback-card">
        <div className="brand-logo-small">IBENTO</div>
        <h2 className="main-title">Feedback for {eventData?.title}</h2>
        
        <form onSubmit={handleSubmit} className="glass-form">
          {eventData?.feedbackSchema?.map((field) => (
            <div key={field.id} className="input-block">
              <label className="section-label">{field.label}</label>
              
              {field.type === "rating" ? (
                <div className="star-row">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      className={`glass-star ${num <= responses[field.label] ? "active" : ""}`}
                      onClick={() => handleInputChange(field.label, num)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              ) : field.type === "select" ? (
                <select 
                  className="glass-select"
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                  required={field.required}
                >
                  <option value="">Select an option</option>
                  {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <textarea
                  className="glass-textarea"
                  placeholder="Your answer..."
                  value={responses[field.label]}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                  required={field.required}
                />
              )}
            </div>
          ))}

          <button type="submit" className="glass-submit-btn" disabled={loading}>
            {loading ? "SENDING..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedbackForm;