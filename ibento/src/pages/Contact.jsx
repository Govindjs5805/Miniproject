import React from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  return (
    <div className="contact-page">
      <style>{`
        .contact-page { min-height: 100vh; padding: 100px 20px; background: #0a0a1a; color: white; }
        .container-box { max-width: 1000px; margin: 0 auto; position: relative; }
        .back-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; margin-bottom: 30px; transition: 0.3s; }
        .back-btn:hover { background: rgba(139, 92, 246, 0.3); border-color: #8b5cf6; }
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .contact-card { background: rgba(255,255,255,0.05); padding: 30px; border-radius: 15px; border: 1px solid rgba(139, 92, 246, 0.2); text-align: center; }
        .icon { font-size: 2rem; color: #22d3ee; margin-bottom: 15px; }
        h2 { color: #8b5cf6; }
      `}</style>
      <div className="container-box">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1 style={{textAlign: 'center', marginBottom: '40px'}}>Contact Support</h1>
        <div className="contact-grid">
          <div className="contact-card">
            <div className="icon">📧</div>
            <h2>Email Us</h2>
            <p>support@ibento.com</p>
          </div>
          <div className="contact-card">
            <div className="icon">📍</div>
            <h2>Office</h2>
            <p>Campus Innovation Hub, Block A</p>
          </div>
          <div className="contact-card">
            <div className="icon">📞</div>
            <h2>Phone</h2>
            <p>+91 98765 43210</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;