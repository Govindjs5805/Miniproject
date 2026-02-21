import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Splash.css";

function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      value += 2;
      setProgress(value);

      if (value >= 100) {
        clearInterval(interval);
        setTimeout(() => navigate("/home"), 500);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="splash">
      <div className="splash-inner">
        <h1 className="logo">IBENTO</h1>
        <div className="loading-bar">
          <div
            className="loading-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default Splash;