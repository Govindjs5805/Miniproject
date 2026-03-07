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
  const [responses, setResponses] = useState({});
  const [activeSchema, setActiveSchema] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false); // Success Toast State

  useEffect(() => {
    const fetchEventSchema = async () => {
      try {
        const eventDoc = await getDoc(doc(db, "events", eventId));
        if (eventDoc.exists()) {
          const data = eventDoc.data();
          setEventData(data);
          
          const schema = data.feedbackSchema && data.feedbackSchema.length > 0 
            ? data.feedbackSchema 
            : [
                { id: 'default_rating', label: 'Overall Rating', type: 'rating', required: true },
                { id: 'default_comment', label: 'Comments', type: 'textarea', required: true }
              ];

          setActiveSchema(schema);

          const initialResponses = {};
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
    if (!user) return alert("Please log in to submit feedback");
    
    setLoading(true);
    try {
      const feedbackRef = doc(db, "feedbacks", `${eventId}_${user.uid}`);
      await setDoc(feedbackRef, {
        eventId,
        userId: user.uid,
        userName: userData?.fullName || user.displayName || "Student",
        userEmail: user.email,
        responses: responses, 
        submittedAt: serverTimestamp(),
      });

      // Show the Green Toast
      setShowSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err) {
      alert("Error submitting feedback: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading">Loading Feedback Form...</div>;

  return (
    <div className="feedback-outer-container">
      
      {/* GREEN TOP-RIGHT SUCCESS TOAST */}
      {showSuccess && (
        <div className="success-toast-container">
          <div className="success-toast-content">
            <span className="toast-icon">✓</span>
            <p>Feedback Received Successfully!</p>
          </div>
        </div>
      )}

      <div className="glass-feedback-card">
        <div className="brand-logo-small">IBENTO</div>
        <h2 className="main-title">Share Your Thoughts</h2>
        <p className="sub-title">{eventData?.title}</p>
        
        <form onSubmit={handleSubmit} className="glass-form">
          {activeSchema.map((field) => (
            <div key={field.id} className="input-block">
              <label className="section-label">
                {field.label} {field.required && <span style={{color: '#ff4d4d'}}>*</span>}
              </label>
              
              {field.type === "rating" ? (
                <div className="star-row">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      className={`glass-star ${num <= (responses[field.label] || 0) ? "active" : ""}`}
                      onClick={() => handleInputChange(field.label, num)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              ) : field.type === "select" ? (
                <select 
                  className="glass-select"
                  value={responses[field.label] || ""}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                  required={field.required}
                >
                  <option value="">Select an option</option>
                  {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <textarea
                  className="glass-textarea"
                  placeholder="Type your response here..."
                  value={responses[field.label] || ""}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                  required={field.required}
                />
              )}
            </div>
          ))}

          <button type="submit" className="glass-submit-btn" disabled={loading}>
            {loading ? "PROCESSING..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedbackForm;