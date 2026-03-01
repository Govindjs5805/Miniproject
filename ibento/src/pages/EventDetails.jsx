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
  
  // Registration Flow States
  const [showFormModal, setShowFormModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState("form"); // 'form', 'selection', 'qr', 'upi', 'success'
  const [formAnswers, setFormAnswers] = useState({});
  const [issubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(5);

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
          if (userReg) setAlreadyRegistered(true);
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

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "registrations"), {
        eventId: id,
        eventTitle: event.title,
        userId: user.uid,
        userName: userData?.fullName || user.displayName || "Student",
        userEmail: user.email,
        answers: formAnswers, 
        paymentId: `PAY_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: event.isPaid ? "Paid" : "Confirmed",
        checkInStatus: false,
        registeredAt: new Date(),
      });

      // Play Success Sound
      const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-37a.mp3");
      audio.play().catch(e => console.log("Audio play blocked"));

      setPaymentStep("success");

      // Auto-redirect countdown
      let timer = 5;
      const interval = setInterval(() => {
        timer -= 1;
        setCountdown(timer);
        if (timer === 0) {
          clearInterval(interval);
          navigate("/dashboard");
        }
      }, 1000);

    } catch (error) {
      alert("Registration failed.");
      setIsSubmitting(false);
    }
  };

  const renderModalContent = () => {
    switch (paymentStep) {
      case "form":
        return (
          <form className="modal-form" onSubmit={(e) => { e.preventDefault(); setPaymentStep(event.isPaid ? "selection" : "submitting"); if(!event.isPaid) handleFinalSubmit(); }}>
            <div className="form-fields-container">
              {event.registrationSchema?.map((field) => (
                <div key={field.id} className="form-group">
                  <label>{field.label} {field.required && <span className="req">*</span>}</label>
                  {field.type === "text" && <input type="text" required={field.required} placeholder={`Enter ${field.label}`} onChange={(e) => handleInputChange(field.label, e.target.value)} />}
                  {field.type === "number" && <input type="number" required={field.required} onChange={(e) => handleInputChange(field.label, e.target.value)} />}
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
                          <input type="radio" name={field.id} required={field.required} value={opt} onChange={(e) => handleInputChange(field.label, e.target.value)} /> 
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
              <button type="submit" className="confirm-btn">{event.isPaid ? "Next: Payment" : "Register Now"}</button>
            </div>
          </form>
        );

      case "selection":
        return (
          <div className="payment-selection-area">
            <div className="pay-header">
              <h3>₹{event.price}</h3>
              <p>Secure Payment for {event.title}</p>
            </div>
            <div className="pay-options">
              <div className="pay-method-card" onClick={() => setPaymentStep("qr")}>
                <div className="pay-icon">📸</div>
                <span>UPI QR Code</span>
              </div>
              <div className="pay-method-card" onClick={() => setPaymentStep("upi")}>
                <div className="pay-icon">📱</div>
                <span>UPI ID</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setPaymentStep("form")}>Back</button>
            </div>
          </div>
        );

      case "qr":
        return (
          <div className="qr-display-area">
            <h3>Scan QR to Pay</h3>
            <div className="qr-box">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=ibento@upi&am=${event.price}&pn=IBENTO`} alt="Payment QR" />
            </div>
            <p className="qr-hint">Use any UPI app like GPay or PhonePe</p>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setPaymentStep("selection")}>Back</button>
              <button className="confirm-btn" onClick={handleFinalSubmit} disabled={issubmitting}>
                {issubmitting ? "Verifying..." : "I have paid"}
              </button>
            </div>
          </div>
        );

      case "upi":
        return (
          <div className="upi-input-area">
            <h3>Enter UPI ID</h3>
            <div className="form-group" style={{marginTop: '20px'}}>
              <input type="text" placeholder="e.g. user@okaxis" className="upi-input-field" />
            </div>
            <p className="upi-hint">You will receive a request on your UPI app</p>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setPaymentStep("selection")}>Back</button>
              <button className="confirm-btn" onClick={handleFinalSubmit} disabled={issubmitting}>
                {issubmitting ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="payment-success-screen">
            <div className="success-check-wrapper">
              <div className="success-check">L</div>
            </div>
            <h2>Payment Successful</h2>
            <p>Registration for <strong>{event.title}</strong> is confirmed.</p>
            <div className="redirect-timer">Redirecting in {countdown}s...</div>
            <button className="confirm-btn" onClick={() => navigate("/dashboard")} style={{marginTop: '20px'}}>Go to Dashboard Now</button>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) return <div className="loading-screen">Loading Event...</div>;
  if (!event) return <div className="error-screen">Event not found.</div>;

  const today = new Date().toISOString().split("T")[0];
  const isPastEvent = event.date < today;
  const seatsLeft = event.seatLimit - registeredCount;

  return (
    <div className="event-page-wrapper">
      <div className="event-hero-container">
        <div className="poster-section">
          <img src={event.posterURL} alt={event.title} className="full-poster-image" />
        </div>

        <div className="details-section">
          <div className="details-content-inner">
            <div className="category-tag">{event.category || "Upcoming Event"}</div>
            <h1 className="event-main-title">{event.title}</h1>
            <p className="event-hero-description">{event.description}</p>

            <div className="event-stats-grid">
              <div className="stat-item">
                <span className="stat-label">Date</span>
                <span className="stat-value">{event.date}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Venue</span>
                <span className="stat-value">{event.venue}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Fee</span>
                <span className="stat-value">{event.isPaid ? `₹${event.price}` : "FREE"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Seats Left</span>
                <span className="stat-value">{seatsLeft > 0 ? seatsLeft : 0}</span>
              </div>
            </div>

            <div className="main-action-area">
              {user ? (
                role === "student" ? (
                  <>
                    {isPastEvent ? (
                      alreadyRegistered ? (
                        <button onClick={() => navigate(`/feedback/${id}`)} className="feedback-btn-alt">Give Feedback ⭐</button>
                      ) : (
                        <button disabled className="status-btn-disabled">Event Expired</button>
                      )
                    ) : alreadyRegistered ? (
                      <button disabled className="status-btn-success">Already Registered ✅</button>
                    ) : seatsLeft > 0 ? (
                      <button onClick={() => { setPaymentStep("form"); setShowFormModal(true); }} className="hero-register-btn">
                        {event.isPaid ? "Register & Pay" : "Register Now"}
                      </button>
                    ) : (
                      <button disabled className="status-btn-disabled">Sold Out</button>
                    )}
                  </>
                ) : (
                  <p className="admin-notice">Admins cannot register.</p>
                )
              ) : (
                <button onClick={() => navigate("/login")} className="hero-register-btn">Login to Register</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showFormModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-pop">
            <div className="modal-header">
              <h2>{paymentStep === 'success' ? 'Confirmed' : paymentStep === 'form' ? 'Registration' : 'Payment'}</h2>
            </div>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetails;