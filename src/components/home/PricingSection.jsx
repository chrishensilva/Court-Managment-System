import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  return (
    <section className="section" id="pricing">
      <div className="container">
        <h2 className="section-title">Simple, Transparent Pricing</h2>
        <p className="section-subtitle">Choose the perfect plan for your legal practice.</p>

        <div className="pricing-grid">
          
          <div className="pricing-card">
            <h3 className="pricing-tier">Starter</h3>
            <p className="pricing-desc" style={{ color: 'var(--color-gray-500)', marginBottom: '1rem' }}>Best For Solo lawyers</p>
            <div className="pricing-price">Free</div>
            <div className="pricing-features">
              <div className="pricing-feature"><Check size={20} /> 1 User Account</div>
              <div className="pricing-feature"><Check size={20} /> Up to 50 Cases</div>
              <div className="pricing-feature"><Check size={20} /> Basic Dashboard</div>
            </div>
            <Link to="/register" className="btn btn-outline" style={{width: '100%'}}>Start for Free</Link>
          </div>

          <div className="pricing-card emphasized">
            <h3 className="pricing-tier">Professional</h3>
            <p className="pricing-desc" style={{ color: 'var(--color-gray-500)', marginBottom: '1rem' }}>Best For Small firms</p>
            <div className="pricing-price">$49<span style={{fontSize: '1rem', color: 'var(--color-gray-500)'}}>/mo</span></div>
            <div className="pricing-features">
              <div className="pricing-feature"><Check size={20} /> Unlimited Users & Cases</div>
              <div className="pricing-feature"><Check size={20} /> Email Automation</div>
              <div className="pricing-feature"><Check size={20} /> Advanced Reports</div>
              <div className="pricing-feature"><Check size={20} /> Priority Support</div>
            </div>
            <Link to="/register" className="btn btn-primary" style={{width: '100%'}}>Start 14-Day Trial</Link>
          </div>

          <div className="pricing-card">
            <h3 className="pricing-tier">Enterprise</h3>
            <p className="pricing-desc" style={{ color: 'var(--color-gray-500)', marginBottom: '1rem' }}>Best For Large firms</p>
            <div className="pricing-price">Custom</div>
            <div className="pricing-features">
              <div className="pricing-feature"><Check size={20} /> Everything in Pro</div>
              <div className="pricing-feature"><Check size={20} /> Dedicated Support</div>
              <div className="pricing-feature"><Check size={20} /> Custom Integrations</div>
              <div className="pricing-feature"><Check size={20} /> SLA Guarantee</div>
            </div>
            <Link to="/contact" className="btn btn-outline" style={{width: '100%'}}>Contact Sales</Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PricingSection;
