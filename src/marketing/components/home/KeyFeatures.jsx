import React from 'react';
import { Layers, Users, RefreshCw, Calendar, PieChart, FileText, Mail, Shield, ShieldCheck } from 'lucide-react';
import './Home.css';

const features = [
  {
    icon: <Layers size={32} />,
    title: 'Case Management',
    desc: 'Add new cases with full client information and track them through every stage. Filter, search, and view complete history.'
  },
  {
    icon: <Users size={32} />,
    title: 'Lawyer Management',
    desc: 'Maintain a complete directory of lawyers. Add new members and see who is available and assigned to which cases.'
  },
  {
    icon: <RefreshCw size={32} />,
    title: 'Case Assignment',
    desc: 'Assign any lawyer to any case with a single dropdown. Trigger automatic assignments instantly.'
  },
  {
    icon: <Calendar size={32} />,
    title: 'Hearing Calendar',
    desc: 'Never miss a court date. Interactive calendar highlights upcoming hearings and sorts them automatically.'
  },
  {
    icon: <PieChart size={32} />,
    title: 'Analytics Dashboard',
    desc: 'Real-time summary cards and charts for total clients, lawyers, and cases. Keep the big picture at a glance.'
  },
  {
    icon: <FileText size={32} />,
    title: 'Report Generation',
    desc: 'Generate complete print-ready case reports, filterable by case type. Export to CSV in seconds.'
  },
  {
    icon: <Mail size={32} />,
    title: 'Automated Emails',
    desc: 'System sends professional email notifications to lawyers on case updates. Configuration is easy.'
  },
  {
    icon: <Shield size={32} />,
    title: 'Role-Based Access',
    desc: 'Ensure data security with Admin and Editor roles, granting custom permissions exactly where needed.'
  },
  {
    icon: <ShieldCheck size={32} />,
    title: 'Multi-Tenant Support',
    desc: 'Built for teams. Multiple law firms use the platform safely with complete data isolation per organization.'
  }
];

const KeyFeatures = () => {
  return (
    <section className="features-section bg-gray-50">
      <div className="container">
        <h2 className="section-title">Everything Your Legal Team Needs — In One Place</h2>
        <p className="section-subtitle">
          From case intake to final verdict, Court CMS handles it all. No spreadsheets. No sticky notes. No missed hearings.
        </p>
        
        <div className="features-grid">
          {features.map((feat, idx) => (
            <div className="feature-card" key={idx}>
              <div className="feature-icon">{feat.icon}</div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
