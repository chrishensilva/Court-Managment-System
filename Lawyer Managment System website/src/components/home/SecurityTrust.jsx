import React from 'react';
import { Lock, Key, Activity, Layers, Link2, ShieldAlert } from 'lucide-react';
import './Home.css';

const items = [
  { icon: <Lock />, title: 'JWT Authentication', desc: 'Secure, stateless tokens for API requests' },
  { icon: <Key />, title: 'bcrypt Password Hashing', desc: 'Industry-standard secure password storage' },
  { icon: <Activity />, title: 'API Rate Limiting', desc: 'Protection against brute-force abuse' },
  { icon: <Layers />, title: 'Multi-Tenant Isolation', desc: 'Complete data segregation per organization' },
  { icon: <Link2 />, title: 'HTTPS Everywhere', desc: 'Deployed with SSL encryption' },
  { icon: <ShieldAlert />, title: '2FA Coming Soon', desc: 'Two-Factor Auth planned for v1.1' },
];

const SecurityTrust = () => {
  return (
    <section className="security-section bg-primary text-white">
      <div className="container">
        <h2 className="section-title text-white">Enterprise-Grade Security</h2>
        <div className="security-grid">
          {items.map((i, idx) => (
            <div className="security-card" key={idx}>
              <div className="security-icon">{i.icon}</div>
              <h4>{i.title}</h4>
              <p>{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecurityTrust;
