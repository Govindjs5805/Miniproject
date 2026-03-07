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
        'service_3u2u3we',   
        'template_f9axmxh',  
        templateParams,
        'oxGLsxqSlC6va58K6'    
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
    <div className="page-wrapper">
      <style>{`
        .page-wrapper { 
          min-height: 100vh; 
          padding: 100px 20px; 
          background: radial-gradient(circle at top right, #1a1a3a, #0a0a1a); 
          color: white; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          font-family: 'Poppins', sans-serif;
        }
        .glass-card { 
          width: 100%; max-width: 500px; 
          background: rgba(255, 255, 255, 0.03); 
          backdrop-filter: blur(15px); 
          padding: 100px 20px; border-radius: 24px; 
          border: 1px solid rgba(139, 92, 246, 0.2); 
          display: flex; flex-direction: column; gap: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }
        .header-section { display: flex; flex-direction: column; gap: 16px; }
        .back-btn { 
          align-self: flex-start;
          background: rgba(255,255,255,0.05); 
          border: 1px solid rgba(255,255,255,0.1); 
          color: #94a3b8; padding: 10px 20px; border-radius: 12px; cursor: pointer;
          transition: all 0.3s ease; font-size: 0.9rem;
        }
        .back-btn:hover { background: rgba(139, 92, 246, 0.2); color: white; border-color: #8b5cf6; }
        h2 { color: #a855f7; margin: 0; font-size: 2rem; letter-spacing: -0.5px; }
        .sub-text { color: #94a3b8; font-size: 0.95rem; margin: 0; line-height: 1.5; }
        textarea { 
          width: 100%; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); 
          border-radius: 16px; padding: 18px; color: white; height: 160px; outline: none; 
          resize: none; font-family: inherit; transition: 0.3s; box-sizing: border-box;
        }
        textarea:focus { border-color: #8b5cf6; background: rgba(0,0,0,0.4); }
        .submit-btn { 
          width: 100%; padding: 16px; 
          background: linear-gradient(135deg, #7c3aed, #a855f7); 
          border: none; border-radius: 16px; color: white; font-weight: 600; 
          cursor: pointer; transition: 0.3s; font-size: 1rem;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(124, 58, 237, 0.3); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .toast { 
          position: fixed; top: 40px; right: 40px; 
          background: #10b981; padding: 16px 28px; border-radius: 12px; 
          color: white; z-index: 10000; font-weight: 500;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
          animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes slideIn { from { transform: translateX(120%); } to { transform: translateX(0); } }
      `}</style>

      {sent && <div className="toast">✓ Suggestion sent successfully!</div>}

      <div className="glass-card">
        <div className="header-section">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <div>
            <h2>Make a Suggestion</h2>
            <p className="sub-text">Help us make IBENTO better for the community.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <textarea 
            placeholder="What should we improve or add?" 
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            required 
          />
          <button type="submit" className="btn submit-btn" disabled={loading}>
            {loading ? "Sending Message..." : "Submit Suggestion"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Suggestions;