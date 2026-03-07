import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email first to reset password.");
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, formData.email);
      triggerToast("Reset link sent! Check your inbox.");
      setError("");
    } catch (err) {
      setError("Failed to send reset email. Check if email is correct.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Reload to get latest verification status
      await userCredential.user.reload();

      if (!userCredential.user.emailVerified) {
        navigate("/verify-email");
        setLoading(false);
        return;
      }

      // 1. Set the role immediately
      localStorage.setItem("role", "student");

      // 2. Navigate IMMEDIATELY. 
      // Artificial delays in Login often cause the "flicker" issue 
      // with Protected Routes in App.js
      navigate("/home");
      
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle at top left, #1e1b4b, #0f0c29);
          padding: 20px;
          font-family: sans-serif;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          padding: 40px;
          border-radius: 18px;
          background: rgba(30, 27, 75, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(168, 85, 247, 0.2);
          box-shadow: 0 0 40px rgba(168, 85, 247, 0.3);
          text-align: center;
          position: relative;
        }

        .custom-toast-glass {
          position: fixed;
          top: 30px;
          right: 30px;
          background: rgba(16, 185, 129, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid #10b981;
          padding: 12px 20px;
          border-radius: 10px;
          z-index: 10000;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
          animation: slideIn 0.4s ease-out forwards;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .auth-card h2 {
          font-size: 28px;
          margin-bottom: 10px;
          color: #c4b5fd;
        }

        .auth-subtitle {
          font-size: 14px;
          color: #a1a1aa;
          margin-bottom: 25px;
        }

        .input-group {
          position: relative;
          width: 100%;
          margin-bottom: 15px;
        }

        .auth-card input {
          width: 100%;
          padding: 12px 15px;
          border-radius: 10px;
          border: 1px solid rgba(168, 85, 247, 0.3);
          background: rgba(255, 255, 255, 0.05);
          color: white;
          outline: none;
          font-size: 14px;
          transition: 0.3s;
          box-sizing: border-box;
        }

        .password-field { padding-right: 45px !important; }

        .toggle-password-btn {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.5;
        }

        .toggle-password-btn.active { opacity: 1; color: #a855f7; }

        .forgot-link {
          display: block;
          text-align: right;
          font-size: 12px;
          color: #a1a1aa;
          margin-top: -10px;
          margin-bottom: 20px;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
        }

        .forgot-link:hover { color: #c4b5fd; text-decoration: underline; }

        .auth-card button[type="submit"] {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(90deg, #7c3aed, #a855f7);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .auth-card button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-footer { margin-top: 20px; font-size: 14px; color: #a1a1aa; }
        .auth-footer a { color: #a855f7; text-decoration: none; }
      `}</style>

      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className="custom-toast-glass">
          <span style={{color: '#10b981', fontWeight: 'bold'}}></span>
          <span style={{color: 'white', fontSize: '14px'}}>{toastMsg}</span>
        </div>
      )}

      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue</p>

          {error && (
            <div className="auth-error" style={{color: '#f87171', fontSize: '13px', marginBottom: '15px'}}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="password-field"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className={`toggle-password-btn ${showPassword ? "active" : ""}`}
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </button>
            </div>

            <button type="button" className="forgot-link" onClick={handleForgotPassword}>
              Forgot Password?
            </button>

            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Login"}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;