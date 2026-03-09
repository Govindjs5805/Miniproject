import React, { useEffect, useState } from 'react';
import { db } from "../../firebase";
import { collection, query, onSnapshot, limit } from "firebase/firestore"; 
import { FaStar, FaQuoteRight } from 'react-icons/fa';
import './Reviews.css';

const Reviews = () => {
  const [realReviews, setRealReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Establish persistent WebSocket connection
    const feedbackCollection = collection(db, "feedbacks");
    const q = query(feedbackCollection, limit(20)); // Get more to find valid text

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allFeedback = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // LOGIC FIX: In your Admin Dashboard (image_2dec16.png), 
        // the text is stored under specific question keys. 
        // We look for 'responses' or common keys like 'How was the event?'
        const mainComment = data.responses?.["How was the event?"] || 
                           data.comment || 
                           data.feedback || 
                           data.feedbackText || 
                           "Excellent event!"; // Fallback

        return {
          id: doc.id,
          ...data,
          displayContent: mainComment
        };
      });

      // 2. Sort by length to show the most detailed student responses
      const topThree = allFeedback
        .sort((a, b) => b.displayContent.length - a.displayContent.length)
        .slice(0, 3);

      setRealReviews(topThree);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup WebSocket
  }, []);

  if (loading) return <div className="reviews-loader">Loading...</div>;

  return (
    <section className="reviews-section">
      <div className="reviews-header">
        <h2 className="massive-title">REVIEWS</h2>
        <p className="subtitle">Real Feedback from <span>Our Students</span></p>
      </div>

      <div className="reviews-container">
        {realReviews.length === 0 ? (
          <p className="no-reviews">No detailed reviews available yet.</p>
        ) : (
          realReviews.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="quote-icon"><FaQuoteRight /></div>
              
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < (review.rating || 5) ? "star-filled" : "star-empty"} 
                  />
                ))}
              </div>

              {/* FIX: Use the 'displayContent' we extracted above */}
              <p className="review-text">
                "{review.displayContent}"
              </p>
              
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  {(review.name || review.userName || "S").charAt(0)}
                </div>
                <div>
                  <h4>{review.name || review.userName || "Student"}</h4>
                  <span>{review.eventTitle || "NAVIRA 2.0 Attendee"}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Reviews;