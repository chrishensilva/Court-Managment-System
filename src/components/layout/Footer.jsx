import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-column">
            <h4 className="footer-heading">Product</h4>
            <div className="footer-links">
              <Link to="/features">Features</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/security">Security</Link>
              <Link to="#">Changelog / Roadmap</Link>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Resources</h4>
            <div className="footer-links">
              <Link to="#">Documentation</Link>
              <Link to="#">FAQ</Link>
              <Link to="#">Support</Link>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Legal</h4>
            <div className="footer-links">
              <Link to="#">Privacy Policy</Link>
              <Link to="#">Terms of Service</Link>
              <Link to="#">Cookie Policy</Link>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <div className="footer-links">
              <Link to="#">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="#">GitHub</Link>
            </div>
          </div>

        </div>
        
        <div className="footer-bottom">
          <p className="footer-tagline">
            ⚖️ Court Case Management System — © 2026 ChrishenSilva. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
