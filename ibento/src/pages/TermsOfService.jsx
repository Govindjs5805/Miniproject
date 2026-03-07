import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();
  return (
    <div className="legal-container">
      <style>{`
        .legal-container { padding: 240px 20px; background: #0a0a1a; color: #cbd5e1; line-height: 1.6; }
        .legal-box { max-width: 800px; margin: -150px auto; background: rgba(255,255,255,0.02); padding: 120px 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); position: relative; }
        .back-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; transition: 0.3s; }
        .back-btn:hover { background: rgba(139, 92, 246, 0.3); border-color: #8b5cf6; }
        h2 { color: #8b5cf6; }
        h1 { color: #8b5cf6; text-align: center; 
          margin-bottom: 30px; 
          font-size: 2rem; 
          font-weight: bold;}
      `}</style>
      <div className="legal-box">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1>TERMS OF SERVICE</h1>
        <p>By using IBENTO, you agree to the following terms:</p>
        <h2>1. User Conduct</h2>
        <p>Users must provide accurate information during registration. Misuse of the QR code check-in system may lead to account suspension.</p>
        <h2>2. Event Attendance</h2>
        <p>Registration does not always guarantee entry if the venue reaches maximum capacity. Please arrive on time.</p>
        <h2>3. Changes to Service</h2>
        <p>We reserve the right to modify or terminate the service at any time for maintenance or platform upgrades.</p>
      </div>
    </div>
  );
};

export default TermsOfService;