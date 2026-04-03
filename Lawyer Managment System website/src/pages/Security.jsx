import React from 'react';
import SecurityTrust from '../components/home/SecurityTrust';

const Security = () => {
  return (
    <div className="page" style={{ paddingTop: '80px', minHeight: '80vh' }}>
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 className="section-title">Your Data, Secured.</h1>
        <p className="section-subtitle">We use enterprise-grade security to ensure your legal documents and client information are safe.</p>
      </div>
      <SecurityTrust />
    </div>
  );
};

export default Security;
