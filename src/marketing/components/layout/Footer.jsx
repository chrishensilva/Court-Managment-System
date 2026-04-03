import React from 'react';
import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link to="/" className="nav-logo">
            <Scale size={32} color="var(--color-accent)" />
            <span>Court CMS</span>
          </Link>
          <p>
            Manage Every Case. Empower Every Lawyer. Miss Nothing.
            The all-in-one cloud-based platform for modern legal teams.
          </p>
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h4>Product</h4>
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/security">Security</Link>
            <a href="#roadmap">Changelog / Roadmap</a>
          </div>
          
          <div className="footer-column">
            <h4>Resources</h4>
            <Link to="/docs">Documentation</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/support">Support</Link>
          </div>
          
          <div className="footer-column">
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
          
          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>⚖️ Court Case Management System — &copy; {new Date().getFullYear()} ChrishenSilva. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
