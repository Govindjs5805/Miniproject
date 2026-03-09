import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Splash.css";

function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      const increment = Math.random() * 2;
      value += increment;

      if (value >= 100) {
        value = 100;
        clearInterval(interval);
        // Reduced delay for a faster minimal feel
        setTimeout(() => navigate("/home"), 800);
      }
      setProgress(value);
    }, 30);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="minimal-splash">
      <div className="central-brand">
        {/* Logo with Hero Section Styling */}
        <h1 className="hero-style-logo">IBENTO</h1>
        
        <div className="progress-wrapper">
          <div className="progress-rail">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="percentage">{Math.round(progress)}%</span>
        </div>
      </div>
      
      <footer className="splash-footer">
        <span>EST. 2026</span>
        <div className="dot"></div>
        <span>SECURE GATEWAY</span>
      </footer>
    </div>
  );
}

export default Splash;