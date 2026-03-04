import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { sendEmailVerification, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // Track the "Pop-up" state
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.emailVerified) {
          navigate("/home");
        }
      } else {
        navigate("/login");
      }
    });

    // --- AUTOMATIC POLLING ---
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          clearInterval(interval);
          setIsVerified(true); // Trigger the success UI
          
          // Wait 2 seconds so they can see the "Success" message before redirecting
          setTimeout(() => {
            navigate("/home");
          }, 2500);
        }
      }
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [navigate]);

  const handleResendEmail = async () => {
    if (!user) return;
    setLoading(true);
    setMessage("");
    try {
      await sendEmailVerification(user);
      setMessage("A new verification link has been sent!");
    } catch (error) {
      setMessage("Too many requests. Please wait a moment.");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .verify-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle at top left, #1e1b4b, #0f0c29);
          padding: 20px;
          font-family: sans-serif;
          position: relative;
          overflow: hidden;
        }

        .verify-card {
          width: 100%;
          max-width: 420px;
          padding: 40px;
          border-radius: 18px;
          background: rgba(30, 27, 75, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(168, 85, 247, 0.2);
          box-shadow: 0 0 40px rgba(168, 85, 247, 0.3);
          text-align: center;
          color: white;
          transition: opacity 0.5s ease;
        }

        /* SUCCESS POPUP STYLES */
        .success-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: #0f0c29;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 100;
          animation: fadeIn 0.5s ease;
        }

        .checkmark-circle {
          width: 80px;
          height: 80px;
          background: #22c55e;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 40px;
          margin-bottom: 20px;
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .verify-card h2 { color: #c4b5fd; margin-bottom: 15px; }
        .verify-card p { color: #a1a1aa; line-height: 1.6; margin-bottom: 25px; }

        .loading-dots:after {
          content: ' .';
          animation: dots 1.5s steps(5, end) infinite;
        }

        @keyframes dots {
          0%, 20% { color: rgba(0,0,0,0); text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0); }
          40% { color: white; text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0); }
          60% { text-shadow: .25em 0 0 white, .5em 0 0 rgba(0,0,0,0); }
          80%, 100% { text-shadow: .25em 0 0 white, .5em 0 0 white; }
        }

        .status-msg {
          background: rgba(34, 197, 94, 0.1);
          color: #4ade80;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 13px;
        }

        .resend-link, .logout-link {
          background: none;
          border: none;
          color: #a855f7;
          text-decoration: underline;
          cursor: pointer;
          font-size: 14px;
          margin: 0 10px;
        }
      `}</style>

      <div className="verify-container">
        {/* The "Pop-up" Message */}
        {isVerified && (
          <div className="success-overlay">
            <div className="checkmark-circle">✓</div>
            <h2 style={{color: '#4ade80'}}>Email Verified!</h2>
            <p style={{color: '#a1a1aa'}}>Redirecting you to the home page...</p>
          </div>
        )}

        <div className="verify-card" style={{ opacity: isVerified ? 0 : 1 }}>
          <h2>Verify Your Email 📧</h2>
          <p>
            We've sent a link to <strong>{user?.email}</strong>.<br /> 
            Waiting for verification<span className="loading-dots"></span>
          </p>

          {message && <div className="status-msg">{message}</div>}

          <div style={{ marginTop: "20px" }}>
            <button className="resend-link" onClick={handleResendEmail} disabled={loading}>
              {loading ? "Sending..." : "Resend Email"}
            </button>
            <span style={{color: '#3f3f46'}}>|</span>
            <button className="logout-link" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;