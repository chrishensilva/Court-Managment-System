import React from 'react';
import { CheckCircle } from 'lucide-react';
import './Home.css';

const roles = [
  { role: 'Law Firm Administrators', desc: 'Full visibility, team control, billing, and audit logs' },
  { role: 'Senior Lawyers', desc: 'Manage their own caseload and client information' },
  { role: 'Junior / Associate Lawyers', desc: 'View assigned cases, check upcoming hearings' },
  { role: 'Legal Secretaries / Clerks', desc: 'Add new cases and clients, update court dates' },
  { role: 'Office Managers', desc: 'Generate reports, track firm performance' },
];

const WhoIsItFor = () => {
  return (
    <section className="who-section bg-gray-50">
      <div className="container">
        <h2 className="section-title">Built for Every Role in Your Legal Team</h2>
        <div className="roles-list">
          {roles.map((r, idx) => (
            <div className="role-item" key={idx}>
              <CheckCircle className="role-icon" color="var(--color-accent)" size={24} />
              <div>
                <h4>{r.role}</h4>
                <p>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoIsItFor;
