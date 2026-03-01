import React, { useEffect, useState } from 'react';
import { db } from "../../firebase";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { FaStar, FaQuoteRight } from 'react-icons/fa';
import './Reviews.css';

const Reviews = () => {
  const [realReviews, setRealReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // The hook must be at the top level of the component
  useEffect(() => {
  const fetchTopFeedbacks = async () => {
    try {
      const feedbackCollection = collection(db, "feedbacks"); 
      const querySnapshot = await getDocs(feedbackCollection);
      
      const allFeedback = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by text length (descending) and take the top 3
      const topThree = allFeedback
        .sort((a, b) => {
          const textA = (a.feedback || a.comment || "").length;
          const textB = (b.feedback || b.comment || "").length;
          return textB - textA; // Largest first
        })
        .slice(0, 3); // Get only the first 3 results

      console.log("Top 3 Longest Reviews:", topThree);
      setRealReviews(topThree);
    } catch (error) {
      console.error("Firebase Error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchTopFeedbacks();
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
          <p className="no-reviews">No reviews yet. Be the first to share your experience!</p>
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

              {/* This line checks for different possible database field names */}
              <p className="review-text">
                "{review.feedback || review.comment || review.feedbackText || "Great event!"}"
              </p>
              
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  {(review.name || review.userName || review.fullName || "S").charAt(0)}
                </div>
                <div>
                  <h4>{review.name || review.userName || review.fullName || "Student"}</h4>
                  <span>{review.eventTitle || "Attendee"}</span>
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