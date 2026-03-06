import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Splash.css";

function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      // Non-linear progress for realism
      const randomInc = Math.random() * (value > 80 ? 0.8 : 3.5);
      value += randomInc;

      if (value >= 100) {
        value = 100;
        clearInterval(interval);
        setTimeout(() => navigate("/home"), 1200);
      }
      setProgress(value);
    }, 45);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="hyper-splash">
      {/* Dynamic Background */}
      <div className="space-grid"></div>
      <div className="vignette-overlay"></div>
      
      {/* Corner UI - Now with "Tracing" Animation */}
      <div className="corner top-left"></div>
      <div className="corner top-right"></div>
      <div className="corner bottom-left"></div>
      <div className="corner bottom-right"></div>

      {/* Floating UI Metadata */}
      <aside className="ui-meta left">
        <div className="meta-item"><span>STATUS</span><span className="val">ENCRYPTED</span></div>
        <div className="meta-item"><span>NODE</span><span className="val">IB-092</span></div>
        <div className="meta-item"><span>PACKET</span><span className="val">SYNC_ACTIVE</span></div>
      </aside>

      <aside className="ui-meta right">
        <div className="meta-item"><span>FPS</span><span className="val">60.0</span></div>
        <div className="meta-item"><span>TEMP</span><span className="val">32°C</span></div>
        <div className="meta-item"><span>LOAD</span><span className="val">{Math.round(progress * 0.8)}%</span></div>
      </aside>

      <main className="central-hub">
        <div className="logo-box">
          <h1 className="glitch-logo" data-text="IBENTO">IBENTO</h1>
          <div className="reflection">IBENTO</div>
        </div>

        <div className="load-container">
          <div className="bar-labels">
            <span className="task">INITIALIZING_PROTOCOL</span>
            <span className="pct">{Math.round(progress)}%</span>
          </div>
          <div className="power-bar">
            <div className="power-fill" style={{ width: `${progress}%` }}>
              <div className="glow-tip"></div>
            </div>
            {/* Background ticks */}
            <div className="ticks">
              {[...Array(20)].map((_, i) => <span key={i}></span>)}
            </div>
          </div>
          <p className="system-msg">ACCESSING SECURE SERVER... PLEASE STAND BY</p>
        </div>
      </main>
    </div>
  );
}

export default Splash;