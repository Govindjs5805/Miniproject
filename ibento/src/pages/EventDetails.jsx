import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./EventDetails.css";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role, userData } = useAuth();

  const [event, setEvent] = useState(null);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [formAnswers, setFormAnswers] = useState({});
  const [issubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "events", id));
        if (snap.exists()) {
          setEvent({ id: snap.id, ...snap.data() });
        }

        const q = query(collection(db, "registrations"), where("eventId", "==", id));
        const regSnap = await getDocs(q);
        setRegisteredCount(regSnap.size);

        if (user) {
          const userReg = regSnap.docs.find(doc => doc.data().userId === user.uid);
          if (userReg) {
            setAlreadyRegistered(true);
          }
        }
      } catch (err) {
        console.error("Error fetching event:", err);
      }
      setLoading(false);
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id, user]);

  const handleInputChange = (label, value) => {
    setFormAnswers((prev) => ({ ...prev, [label]: value }));
  };

  const completeRegistration = async (paymentId = "FREE") => {
    try {
      setIsSubmitting(true);
      await addDoc(collection(db, "registrations"), {
        eventId: id,
        eventTitle: event.title,
        userId: user.uid,
        userName: userData?.fullName || user.displayName || "Student",
        userEmail: user.email,
        answers: formAnswers, 
        paymentId: paymentId,
        status: event.isPaid ? "Paid" : "Confirmed",
        checkInStatus: false,
        registeredAt: new Date(),
      });

      alert("Registration Successful!");
      setAlreadyRegistered(true);
      setRegisteredCount((prev) => prev + 1);
      setShowFormModal(false);
    } catch (error) {
      console.error(error);
      alert("Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_YOUR_KEY_HERE", 
      amount: event.price * 100,
      currency: "INR",
      name: "IBENTO",
      description: `Payment for ${event.title}`,
      handler: function (response) {
        completeRegistration(response.razorpay_payment_id);
      },
      prefill: {
        name: userData?.fullName || "",
        email: user?.email || "",
      },
      theme: { color: "#a78bfa" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleRegisterClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (event.registrationSchema && event.registrationSchema.length > 0) {
      setShowFormModal(true);
    } else if (event.isPaid) {
      handlePayment();
    } else {
      completeRegistration();
    }
  };

  if (loading) return <div className="loading-screen">Loading Event Details...</div>;
  if (!event) return <div className="error-screen">Event not found.</div>;

  const today = new Date().toISOString().split("T")[0];
  const isPastEvent = event.date < today;
  const seatsLeft = event.seatLimit - registeredCount;

  return (
    <div className="event-details">
      <div className="event-details-container">
        <img src={event.posterURL} alt={event.title} className="event-poster" />
        <div className="event-info">
          <h1 className="event-title">{event.title}</h1>
          <div className="info-grid">
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Organizer:</strong> {event.clubName || event.organizer}</p>
            <p><strong>Fee:</strong> {event.isPaid ? `₹${event.price}` : "Free"}</p>
          </div>

          <div className="seat-info-badge">
            Seats Left: {seatsLeft > 0 ? seatsLeft : 0}
          </div>

          <p className="description-text">{event.description}</p>

          <div className="action-area">
            {user ? (
              role === "student" ? (
                <>
                  {isPastEvent ? (
                    alreadyRegistered ? (
                      <button onClick={() => navigate(`/feedback/${id}`)} className="feedback-btn">Give Feedback ⭐</button>
                    ) : (
                      <button disabled className="expired-btn">Event Expired</button>
                    )
                  ) : alreadyRegistered ? (
                    <button disabled className="registered-badge">Already Registered ✅</button>
                  ) : seatsLeft > 0 ? (
                    <button onClick={handleRegisterClick} className="register-btn">
                      {event.isPaid ? "Register & Pay" : "Register Now"}
                    </button>
                  ) : (
                    <button disabled className="sold-out-btn">Sold Out</button>
                  )}
                </>
              ) : (
                <p className="admin-note">Logged in as {role}. Admins cannot register.</p>
              )
            ) : (
              <button onClick={() => navigate("/login")} className="register-btn">Login to Register</button>
            )}
          </div>
        </div>
      </div>

      {showFormModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-pop">
            <div className="modal-header">
              <h2>Registration Details</h2>
              <p className="modal-subtitle">Please provide the details required by the organizer.</p>
            </div>
            
            <form className="modal-form" onSubmit={(e) => {
              e.preventDefault();
              if (event.isPaid) handlePayment();
              else completeRegistration();
            }}>
              <div className="form-fields-container">
                {event.registrationSchema.map((field) => (
                  <div key={field.id} className="form-group">
                    <label>{field.label} {field.required && <span className="req">*</span>}</label>
                    
                    {field.type === "text" && (
                      <input 
                        type="text" 
                        required={field.required} 
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        onChange={(e) => handleInputChange(field.label, e.target.value)} 
                      />
                    )}

                    {field.type === "number" && (
                      <input 
                        type="number" 
                        required={field.required} 
                        onChange={(e) => handleInputChange(field.label, e.target.value)} 
                      />
                    )}

                    {field.type === "select" && (
                      <select required={field.required} onChange={(e) => handleInputChange(field.label, e.target.value)}>
                        <option value="">Select Option</option>
                        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    )}

                    {field.type === "radio" && (
                      <div className="radio-options-group">
                        {field.options.map(opt => (
                          <label key={opt} className="radio-item">
                            <input 
                              type="radio" 
                              name={field.id} 
                              required={field.required} 
                              value={opt} 
                              onChange={(e) => handleInputChange(field.label, e.target.value)} 
                            /> 
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowFormModal(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="confirm-btn" disabled={issubmitting}>
                  {issubmitting ? "Processing..." : event.isPaid ? "Proceed to Payment" : "Complete Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetails;