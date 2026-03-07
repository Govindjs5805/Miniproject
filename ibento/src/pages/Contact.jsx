import React from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  const contactMethods = [
    { icon: "", label: "Email", value: "support@ibento.com" },
    { icon: "", label: "Location", value: "College of Engineering Chengannur" },
    { icon: "", label: "Phone", value: "+91 9605770892" }
  ];

  return (
    <div className="page-wrapper">
      <style>{`
        .page-wrapper { min-height: 100vh; padding: 120px 20px; background: #0a0a1a; color: white; display: flex; justify-content: center; align-items: center; font-family: 'Poppins', sans-serif; }
        .content-stack { width: 100%; max-width: 900px; display: flex; flex-direction: column; gap: 40px; }
        .back-btn { align-self: flex-start; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 10px 20px; border-radius: 12px; margin-top: 80px; cursor: pointer; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .card { background: rgba(139, 92, 246, 0.05); padding: 40px; border-radius: 24px; border: 1px solid rgba(139, 92, 246, 0.1); text-align: center; transition: 0.3s; }
        .card:hover { transform: translateY(-5px); background: rgba(139, 92, 246, 0.1); }
        .icon { font-size: 3rem; margin-bottom: 20px; display: block; }
        h3 { margin: 10px 0; color: #a855f7; }
      `}</style>

      <div className="content-stack">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1 style={{fontSize: '3rem', margin: 0, textAlign: 'center'}}>Get in <span style={{color:'#8b5cf6'}}>Touch</span></h1>
        <div className="grid">
          {contactMethods.map((m, i) => (
            <div className="card" key={i}>
              <span className="icon">{m.icon}</span>
              <h3>{m.label}</h3>
              <p style={{color: '#94a3b8'}}>{m.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;