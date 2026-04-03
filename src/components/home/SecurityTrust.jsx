import React from 'react';
import { Shield, Key, Server, Lock } from 'lucide-react';

const SecurityTrust = () => {
  const securityFeatures = [
    { icon: <Lock size={32} />, title: "HTTPS Everywhere", desc: "Deployed securely with full SSL encryption to protect data in transit." },
    { icon: <Key size={32} />, title: "JWT Authentication", desc: "Secure, stateless tokens and bcrypt password hashing for all access." },
    { icon: <Server size={32} />, title: "Multi-Tenant Isolation", desc: "Complete data segregation per organization. No data crosses accounts." },
    { icon: <Shield size={32} />, title: "API Rate Limiting", desc: "Enterprise protection against brute-force attacks and abuse." },
  ];

  return (
    <section className="section security-section">
      <div className="container">
        <h2 className="section-title">Enterprise-Grade Security for Sensitive Legal Data</h2>
        <p className="section-subtitle">Trust your data with an isolated, secure, and modern cloud architecture.</p>

        <div className="security-grid">
          {securityFeatures.map((sec, idx) => (
            <div className="security-card" key={idx}>
              <div className="security-icon" style={{ color: 'var(--color-accent)' }}>
                {sec.icon}
              </div>
              <div className="security-info">
                <h3>{sec.title}</h3>
                <p>{sec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecurityTrust;
