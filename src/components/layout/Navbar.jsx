import React from 'react';
import { Link } from 'react-router-dom';
// import '../home/Home.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="nav-logo">
          <Link to="/">Court CMS</Link>
        </div>
        <div className="nav-links">
          <Link to="/features" className="nav-link">Features</Link>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/security" className="nav-link">Security</Link>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn btn-outline nav-login-btn">Log In</Link>
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
