import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      await userCredential.user.reload();

      if (!userCredential.user.emailVerified) {
        navigate("/verify-email");
        setLoading(false);
        return;
      }

      localStorage.setItem("role", "student");
      navigate("/home");
    } catch (err) {
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

        /* --- THE TOGGLE BUTTON --- */
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
          /* DEFAULT: DARK/SUBTLE (Matches the input background better) */
          filter: brightness(0); 
          opacity: 0.4;
        }

        /* ACTIVE: BRIGHT WHITE when viewing */
        .toggle-password-btn.active .eye-icon {
          filter: brightness(0) invert(1); /* Makes it pure white */
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
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue</p>

          {error && <div className="auth-error" style={{color: '#f87171', marginBottom: '15px'}}>{error}</div>}

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
                <span className="eye-icon">👁</span>
              </button>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
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