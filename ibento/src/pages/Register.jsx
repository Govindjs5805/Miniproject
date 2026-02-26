import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Added Firestore methods
import { auth, db } from "../firebase"; // Ensure db is exported from your firebase.js

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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Basic Validation
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

      // 2. Save additional user data to Firestore
      // This ensures the user exists in your database, not just Auth
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: "student", // Default role
        createdAt: new Date().toISOString(),
      });

      // 3. Set local storage for immediate Navbar feedback
      localStorage.setItem("role", "student");

      // 4. Send Verification Email
      await sendEmailVerification(user);

      setSuccess("Account created! Verification email sent. Please check your inbox.");

      // 5. Redirect to verification notice page
      setTimeout(() => {
        navigate("/verify-email");
      }, 2000);

    } catch (err) {
      console.error("Registration Error:", err);
      // Friendly error mapping
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "permission-denied") {
        setError("Database permission denied. Check Firebase Rules.");
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

        .auth-card input {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 15px;
          border-radius: 10px;
          border: 1px solid rgba(168, 85, 247, 0.3);
          background: rgba(255, 255, 255, 0.05);
          color: white;
          outline: none;
          font-size: 14px;
          transition: 0.3s;
        }

        .auth-card input:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.3);
        }

        .auth-card button {
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
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-card button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(168, 85, 247, 0.5);
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
          font-weight: 500;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join the experience ✨</p>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
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