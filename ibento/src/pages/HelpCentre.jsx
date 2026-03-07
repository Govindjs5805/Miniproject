import React from 'react';
import { useNavigate } from 'react-router-dom';

const HelpCentre = () => {
  const navigate = useNavigate();
  const faqs = [
    { q: "How do I register for an event?", a: "Go to the 'Events' tab, select your preferred event, and click 'Register Now'." },
    { q: "Where can I find my ticket?", a: "Once registered, your ticket with a QR code will appear in your 'Dashboard'." },
    { q: "Can I register for multiple events?", a: "Yes, you can register for multiple events as long as they don't overlap." }
  ];

  return (
    <div className="help-container">
      <style>{`
        .help-container { min-height: 100vh; padding: 100px 20px; background: #0a0a1a; color: white; font-family: 'Poppins', sans-serif; }
        .glass-card { max-width: 800px; margin: 0 auto; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px; border-radius: 20px; box-shadow: 0 8px 32px rgba(139, 92, 246, 0.15); position: relative; }
        .back-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; transition: 0.3s; font-size: 0.9rem; }
        .back-btn:hover { background: rgba(139, 92, 246, 0.3); border-color: #8b5cf6; }
        h1 { color: #8b5cf6; text-align: center; margin-bottom: 30px; }
        .faq-item { margin-bottom: 25px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 15px; }
        .faq-item h3 { color: #22d3ee; margin-bottom: 10px; font-size: 1.1rem; }
        .faq-item p { color: #94a3b8; line-height: 1.6; }
      `}</style>
      <div className="glass-card">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1>Help Centre</h1>
        {faqs.map((faq, i) => (
          <div key={i} className="faq-item">
            <h3>{faq.q}</h3>
            <p>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpCentre;