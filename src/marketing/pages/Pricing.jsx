import React from 'react';
import PricingSection from '../components/home/PricingSection';

const Pricing = () => {
  return (
    <div className="page" style={{ paddingTop: '80px', minHeight: '80vh' }}>
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 className="section-title">Plans that scale with your firm</h1>
        <p className="section-subtitle">No hidden fees, cancel anytime.</p>
      </div>
      <PricingSection />
    </div>
  );
};

export default Pricing;
