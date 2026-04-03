import React from 'react';

// Reusing components from Home
import KeyFeatures from '../components/home/KeyFeatures';
import FinalCTA from '../components/home/FinalCTA';

const Features = () => {
  return (
    <div className="page" style={{ paddingTop: '80px' }}>
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 className="section-title">Deep Dive: Features</h1>
        <p className="section-subtitle">Everything you need to run your legal practice efficiently.</p>
      </div>
      <KeyFeatures />
      <FinalCTA />
    </div>
  );
};

export default Features;
