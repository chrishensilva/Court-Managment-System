import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const FinalCTA = () => {
  return (
    <section className="cta-section bg-primary text-white">
      <div className="container text-center">
        <h2 className="section-title text-white">Ready to Bring Order to Your Caseload?</h2>
        <p className="section-subtitle text-gray-300">
          Join law firms already using Court CMS to manage clients, assign lawyers, track hearings, and generate professional reports — all from one beautiful platform.
        </p>
        <div className="cta-buttons">
          <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
          <Link to="/contact" className="btn btn-secondary btn-lg">Book a Demo</Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
