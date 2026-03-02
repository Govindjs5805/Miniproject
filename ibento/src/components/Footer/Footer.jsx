import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaFacebook, FaDiscord } from "react-icons/fa";
import "./footer.css";

const Footer = () => {
    const navigate = useNavigate();

  return (
    <footer className="main-footer">
      {/* 1. CTA Banner Section (Like your screenshot) */}
      <div className="footer-cta-container">
        <div className="footer-cta-card">
          <h2>Join Us to Create, Explore and Organize Campus Events</h2>
          <button 
            className="join-community-btn" 
            onClick={() => navigate('/register')} 
          >
            Join Community
          </button>
        </div>
      </div>

      <div className="footer-content">
        {/* 2. Brand Section */}
        <div className="footer-brand">
          <h2 className="footer-logo">IBENTO</h2>
          <p>Smart Campus Event Management System to discover, organize, and join events at your university. Connect with your campus community.</p>
          <div className="social-links">
            <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="social-icon" />
            </a>
            <a href="https://instagram.com/yourhandle" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="social-icon" />
            </a>
            <a href="https://facebook.com/yourhandle" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="social-icon" />
            </a>
            <a href="https://discord.gg/yourlink" target="_blank" rel="noopener noreferrer">
                <FaDiscord className="social-icon" />
            </a>
          </div>
        </div>

        {/* 3. Links Grid */}
        <div className="footer-links-grid">
          <div className="link-group">
  <h3>Explore</h3>
  <ul>
    <li><Link to="/events">Events</Link></li>
    <li><Link to="/communities">Communities</Link></li>
    <li><Link to="/feedback">Feedback</Link></li>
  </ul>
</div>
          <div className="link-group">
            <h3>My Account</h3>
            <ul>
              <li>My Profile</li>
              <li>Settings</li>
            </ul>
          </div>
          <div className="link-group">
            <h3>Resources</h3>
            <ul>
              <li>Help Center</li>
              <li>Suggestions</li>
            </ul>
          </div>
          <div className="link-group">
            <h3>Company</h3>
            <ul>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 IBENTO. All rights reserved.</p>
        <div className="bottom-policy">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;