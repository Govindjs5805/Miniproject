import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "./Feedback.css";

function FeedbackForm() {
  const { eventId } = useParams();
  const { user, userData } = useAuth(); // Destructured userData for real name fallback
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // FIX: Changed collection name to "feedbacks" to match Admin query
      const feedbackRef = doc(db, "feedbacks", `${eventId}_${user.uid}`);
      
      await setDoc(feedbackRef, {
        eventId,
        userId: user.uid,
        // Fallback hierarchy for the name
        userName: userData?.fullName || user.displayName || "Anonymous Student", 
        userEmail: user.email,
        rating: Number(rating),
        comment: comment.trim(),
        submittedAt: serverTimestamp(),
      });

      alert("Feedback received! Thank you ");
      navigate("/dashboard");
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-outer-container">
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      <div className="glass-feedback-card">
        <div className="brand-logo-small">IBENTO</div>
        <h2 className="main-title">Your Feedback is Important to Us</h2>
        <p className="sub-description">Rate your experience and share your thoughts</p>

        <form onSubmit={handleSubmit} className="glass-form">
          <div className="rating-block">
            <label className="section-label">Rate your experience</label>
            <div className="star-row">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  type="button"
                  key={num}
                  className={`glass-star ${num <= (hover || rating) ? "active" : ""}`}
                  onClick={() => setRating(num)}
                  onMouseEnter={() => setHover(num)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="rating-scale">
              <div className="scale-bar" style={{width: `${(rating/5)*100}%`}}></div>
            </div>
          </div>

          <div className="input-block">
            <label className="section-label">Share your thoughts</label>
            <textarea
              className="glass-textarea"
              placeholder="Tell us what you liked or how we can improve..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="glass-submit-btn" disabled={loading}>
            {loading ? "SENDING..." : "Submit Feedback"}
          </button>
          
          <p className="footer-note">Thank you for helping us make IBENTO better!</p>
        </form>
      </div>
    </div>
  );
}

export default FeedbackForm;