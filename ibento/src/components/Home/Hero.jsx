import LightRays from "../LightRays";
import "./Hero.css";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      
      {/* Background Light Effect */}
      <div className="hero-bg">
        <LightRays
          raysOrigin="top-center"
          raysColor="#8B5CF6"
          raysSpeed={0.8}
          lightSpread={1.4}
          rayLength={4}
          followMouse={true}
          mouseInfluence={0.08}
          noiseAmount={0.05}
          distortion={0.15}
          pulsating={true}
          fadeDistance={1.2}
          saturation={1.2}
        />
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        <h1 className="hero-title">IBENTO</h1>
        <p className="hero-subtitle">
          Smart Campus Event Management System
        </p>

        <div className="hero-buttons">
          <Link to="/events" className="btn-primary">
            Explore Events
          </Link>

          <Link to="/register" className="btn-secondary">
            Get Started
          </Link>
        </div>
      </div>

    </section>
  );
}

export default Hero;