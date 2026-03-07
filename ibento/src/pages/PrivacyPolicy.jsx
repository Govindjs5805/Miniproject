import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="legal-container">
      <style>{`
        .legal-container { padding: 240px 20px; background: #0a0a1a; color: #cbd5e1; line-height: 1.6; }
        .legal-box { max-width: 800px; margin: -150px auto; background: rgba(255,255,255,0.02); padding: 120px 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); position: relative; }
        .back-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; transition: 0.3s; }
        .back-btn:hover { background: rgba(139, 92, 246, 0.3); border-color: #8b5cf6; }
        h2 { color: #8b5cf6;}
        h1 { color: #8b5cf6; text-align: center; 
          margin-bottom: 30px; 
          font-size: 2rem; 
          font-weight: bold;}
      `}</style>
      <div className="legal-box">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1>PRIVACY POLICY</h1>
        <p>Last Updated: October 2023</p>
        <h2>1. Data Collection</h2>
        <p>We collect your name, email, and college details to facilitate event registrations and verify your student status.</p>
        <h2>2. Data Usage</h2>
        <p>Your data is used solely for event organization, attendance tracking, and communication regarding IBENTO updates.</p>
        <h2>3. Security</h2>
        <p>We use Firebase encryption to ensure your personal information remains secure and inaccessible to unauthorized parties.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;