import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { auth } from '../firebase'; 

const Suggestions = () => {
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!suggestion.trim()) return;
    setLoading(true);

    const templateParams = {
      from_email: auth.currentUser?.email || "Anonymous User",
      message: suggestion,
    };

    try {
      await emailjs.send(
        'service_3u2u3we',   // Your Service ID from screenshot
        'template_f9axmxh',  // Paste your Template ID here
        templateParams,
        'oxGLsxqSlC6va58K6'    // Paste your Public Key here
      );
      setSent(true);
      setSuggestion(""); 
      setTimeout(() => setSent(false), 3000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Failed to send. Ensure you checked 'Send email on your behalf' in EmailJS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="suggest-container">
      <style>{`
        .suggest-container { 
          min-height: 100vh; 
          padding: 120px 20px; 
          background: #0a0a1a; 
          color: white; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          font-family: 'Poppins', sans-serif;
        }
        .glass-form { 
          width: 100%; max-width: 500px; 
          background: rgba(255, 255, 255, 0.05); 
          backdrop-filter: blur(12px); 
          padding: 30px; border-radius: 20px; 
          border: 1px solid rgba(139, 92, 246, 0.3); 
          display: flex; flex-direction: column; gap: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        .back-btn { 
          align-self: flex-start;
          background: rgba(255,255,255,0.1); 
          border: 1px solid rgba(255,255,255,0.2); 
          color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer;
        }
        .back-btn:hover { background: rgba(139, 92, 246, 0.3); border-color: #8b5cf6; }
        textarea { 
          width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); 
          border-radius: 12px; padding: 15px; color: white; height: 150px; outline: none; resize: none;
        }
        textarea:focus { border-color: #8b5cf6; }
        .btn { 
          width: 100%; padding: 14px; 
          background: linear-gradient(90deg, #7c3aed, #a855f7); 
          border: none; border-radius: 12px; color: white; font-weight: 600; cursor: pointer;
        }
        .toast { 
          position: fixed; top: 100px; right: 30px; 
          background: rgba(16, 185, 129, 0.95); backdrop-filter: blur(10px);
          border: 1px solid #10b981; padding: 15px 25px; border-radius: 10px; 
          color: white; z-index: 10000; /* High z-index to stay on top of navbar */
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>

      {sent && <div className="toast">Suggestion sent to Admin!</div>}

      <div className="glass-form">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <h2 style={{color: '#8b5cf6', margin: 0}}>Make a Suggestion</h2>
          <p style={{color: '#94a3b8', fontSize: '0.9rem', margin: 0}}>Help us make IBENTO better.</p>
          <textarea 
            placeholder="Tell us what's on your mind..." 
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            required 
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Sending..." : "Submit Suggestion"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Suggestions;