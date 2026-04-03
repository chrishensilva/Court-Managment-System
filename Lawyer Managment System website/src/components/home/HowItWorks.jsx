import React from 'react';
import './Home.css';

const steps = [
  {
    step: '1',
    title: 'Create Your Account',
    desc: 'Sign up for free. Set up your admin account, config emails and invite your team editors with exact permissions.'
  },
  {
    step: '2',
    title: 'Add Lawyers & Cases',
    desc: 'Register lawyers. Add client cases with full details — NIC, contact, case type, court dates, and notes.'
  },
  {
    step: '3',
    title: 'Assign, Track & Report',
    desc: 'Assign lawyers with one click. Calendar tracks hearing dates. Export reports anytime and let the system handle emails.'
  }
];

const HowItWorks = () => {
  return (
    <section className="how-it-works-section">
      <div className="container">
        <h2 className="section-title">Get Up and Running in 3 Simple Steps</h2>
        <div className="steps-container">
          {steps.map((s, idx) => (
            <div className="step-card" key={idx}>
              <div className="step-number">{s.step}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
