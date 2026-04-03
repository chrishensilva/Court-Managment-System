import React from 'react';
import { Shield, Users, Mail, CreditCard, Settings } from 'lucide-react';

const KeyFeatures = () => {
  const features = [
    {
      icon: <Users size={24} />,
      title: "Case Management",
      description: "Track Every Case, Every Detail. Add new cases with full client information and track them through every stage."
    },
    {
      icon: <Shield size={24} />,
      title: "Lawyer Management",
      description: "Maintain a complete directory of all lawyers in your firm with their credentials and availability."
    },
    {
      icon: <Settings size={24} />,
      title: "Case Assignment",
      description: "Assign any lawyer to any case with a single dropdown. Trigger automatic email notifications instantly."
    },
    {
      icon: <CreditCard size={24} />,
      title: "Hearing Calendar",
      description: "Never Miss a Court Date Again. Visual calendar with hearing indicators and upcoming lists."
    },
    {
      icon: <Users size={24} />,
      title: "Analytics Dashboard",
      description: "Your Entire Caseload at a Glance. Real-time summary cards and case type breakdown charts."
    },
    {
      icon: <Mail size={24} />,
      title: "Report Generation",
      description: "Generate real-time case reports. Export to CSV or print directly from the browser."
    },
    {
      icon: <Mail size={24} />,
      title: "Automated Emails",
      description: "Keep Lawyers Informed. Configure Gmail SMTP to automatically notify lawyers of new cases."
    },
    {
      icon: <Shield size={24} />,
      title: "Role-Based Access",
      description: "Give Everyone Exactly the Access They Need. Admin and Editor roles for secure workflow."
    },
  ];

  return (
    <section className="section" id="features">
      <div className="container">
        <h2 className="section-title">Everything Your Legal Team Needs — In One Place</h2>
        <p className="section-subtitle">
          From case intake to final verdict, Court CMS handles it all. No spreadsheets. No sticky notes. No missed hearings.
        </p>

        <div className="features-grid">
          {features.map((feature, idx) => (
            <div className="feature-card" key={idx}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
