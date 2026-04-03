import React from 'react';

const HowItWorks = () => {
  return (
    <section className="section bg-gray-50" id="how-it-works">
      <div className="container">
        <h2 className="section-title">Get Up and Running in 3 Simple Steps</h2>
        <p className="section-subtitle">
          Start managing your firm more effectively today.
        </p>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create Your Account</h3>
            <p>Sign up for free. Set up your organization's admin account, configure your email settings, and invite your team editors with the exact permissions they need.</p>
          </div>
          
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Add Your Lawyers & Cases</h3>
            <p>Register your lawyers in the system. Add new client cases with all their details — NIC, contact, case type, court dates, and notes. Everything in one place.</p>
          </div>
          
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Assign, Track & Report</h3>
            <p>Assign lawyers to cases with one click. The calendar tracks all hearing dates. Export reports anytime. Let the system handle email notifications for you.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
