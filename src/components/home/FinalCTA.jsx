import React from 'react';
import { Link } from 'react-router-dom';

const FinalCTA = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="final-cta">
          <h2>Ready to Bring Order to Your Caseload?</h2>
          <p>Join law firms already using Court CMS to manage clients, assign lawyers, track hearings, and generate professional reports — all from one beautiful platform.</p>
          <div style={{display:'flex', gap:'1rem', justifyContent:'center'}}>
            <Link to="/register" className="btn btn-white" style={{padding:'1rem 2rem'}}>Get Started Free</Link>
            <Link to="/contact" className="btn" style={{border:'1px solid rgba(255,255,255,0.3)', color:'#fff'}}>Book a Demo</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
