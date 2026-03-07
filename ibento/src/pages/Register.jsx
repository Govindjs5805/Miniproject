import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from "../firebase";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Toggle states for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // 2. Save user profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: "student",
        createdAt: new Date().toISOString(),
      });

      // 3. SET LOCAL STORAGE (For Navbar/UI)
      localStorage.setItem("role", "student");

      // 4. TRIGGER EMAIL VERIFICATION
      // We await this to ensure the email is actually sent before moving on
      await sendEmailVerification(user);

      setSuccess("Account created! Verification email sent. Please check your inbox and spam folder.");

      // 5. REDIRECT AFTER SUCCESS
      // Give the user 4 seconds to read the success message
      setTimeout(() => {
        navigate("/verify-email");
      }, 4000);

    } catch (err) {
      console.error("Registration Error:", err);
      // Map Firebase codes to friendly messages
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message);
      }
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

        .password-field {
          padding-right: 45px !important;
        }

        .auth-card input:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.3);
        }

        /* --- TOGGLE BUTTON STYLING --- */
        .toggle-password-btn {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          z-index: 10;
        }

        .eye-icon {
          font-size: 18px;
          transition: all 0.3s ease;
          /* Default: Dark/Subtle */
          filter: brightness(0); 
          opacity: 0.4;
        }

        /* Active: Bright White when viewing */
        .toggle-password-btn.active .eye-icon {
          filter: brightness(0) invert(1);
          opacity: 1;
        }

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
          margin-top: 10px;
        }

        .auth-error {
          background: rgba(255, 0, 0, 0.2);
          color: #f87171;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 13px;
        }

        .auth-success {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 13px;
        }

        .auth-footer {
          margin-top: 20px;
          font-size: 14px;
          color: #a1a1aa;
        }

        .auth-footer a {
          color: #a855f7;
          text-decoration: none;
        }
      `}</style>

      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join the experience</p>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
            </div>

            {/* Password Field */}
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
                <span className="eye-icon">👁</span>
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="password-field"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className={`toggle-password-btn ${showConfirmPassword ? "active" : ""}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <span className="eye-icon">👁</span>
              </button>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;