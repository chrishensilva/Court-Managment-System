import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './Home.css';

const faqs = [
  { q: "Is my data secure?", a: "Absolutely. All data is isolated per organization using multi-tenant architecture. Passwords are bcrypt-hashed, and all API calls require a valid JWT token over HTTPS." },
  { q: "Can multiple team members use the system simultaneously?", a: "Yes. The admin can create editor accounts and assign specific permissions to each. All users work in real-time from the same shared database." },
  { q: "How does email notification work?", a: "You configure your own Gmail account in the settings using a Gmail App Password. The system then sends emails on your behalf when a lawyer is assigned to a case." },
  { q: "Is there a mobile version?", a: "The web application is fully responsive and works on mobile browsers. A dedicated mobile app is on the roadmap." },
  { q: "Can I export my data?", a: "Yes. From the Generate Report page, you can export a full CSV file of all case data at any time." },
  { q: "What is the difference between Admin and Editor?", a: "Admin has full access. Editors receive a custom subset of permissions configured by the Admin." },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleFAQ = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="faq-section bg-gray-50">
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div className="faq-item" key={idx}>
              <button className="faq-q" onClick={() => toggleFAQ(idx)}>
                <span>{faq.q}</span>
                {openIdx === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {openIdx === idx && <div className="faq-a">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
