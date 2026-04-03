import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    desc: 'Best for Solo lawyers',
    features: ['1 user', 'Up to 50 cases', 'Basic case management', 'Community support'],
    cta: 'Start for Free',
    isPro: false
  },
  {
    name: 'Professional',
    price: '$29',
    period: '/month',
    desc: 'Best for Small firms',
    features: ['Unlimited users', 'Unlimited cases', 'Email automation', 'Priority support', 'Report Generation'],
    cta: 'Start 14-Day Trial',
    isPro: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'Best for Large firms',
    features: ['Dedicated support', 'Custom integrations', 'Custom SLAs', 'Advanced analytics'],
    cta: 'Contact Sales',
    isPro: false
  }
];

const PricingSection = () => {
  return (
    <section className="pricing-section bg-gray-50">
      <div className="container">
        <h2 className="section-title">Simple, Transparent Pricing</h2>
        <div className="pricing-grid">
          {plans.map((p, idx) => (
            <div className={`pricing-card ${p.isPro ? 'pro' : ''}`} key={idx}>
              {p.isPro && <div className="pro-badge">Most Popular</div>}
              <h3>{p.name}</h3>
              <div className="price">
                <span className="amount">{p.price}</span>
                {p.period && <span className="period">{p.period}</span>}
              </div>
              <p className="desc">{p.desc}</p>
              <ul className="plan-features">
                {p.features.map((f, i) => (
                  <li key={i}><Check size={16} color="var(--color-accent)" /> <span>{f}</span></li>
                ))}
              </ul>
              <Link to={p.name === 'Enterprise' ? '/contact' : '/register'} className={`btn ${p.isPro ? 'btn-primary' : 'btn-outline'}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
