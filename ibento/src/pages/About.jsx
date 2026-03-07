import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="about-page">
      <style>{`
        .about-page { min-height: 100vh; padding: 100px 20px; background: #0a0a1a; color: white; }
        .glass-content { max-width: 900px; margin: 0 auto; background: rgba(255,255,255,0.03); padding: 50px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.05); position: relative; }
        .back-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; transition: 0.3s; }
        .back-btn:hover { background: rgba(139, 92, 246, 0.3); border-color: #8b5cf6; }
        .accent { color: #8b5cf6; font-weight: bold; }
        p { line-height: 1.8; color: #cbd5e1; font-size: 1.1rem; text-align: center; }
        h1 { text-align: center; }
      `}</style>
      <div className="glass-content">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1>About <span className="accent">IBENTO</span></h1>
        <p>
          IBENTO is a next-generation event management platform designed for college campuses. 
          We bridge the gap between organizers and students through seamless registration, 
          digital check-ins, and real-time feedback loops.
        </p>
        <p>Our mission is to foster community engagement by making campus events more accessible and organized.</p>
      </div>
    </div>
  );
};

export default About;