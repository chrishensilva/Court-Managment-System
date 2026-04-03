import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    { question: "Is my data secure?", answer: "Absolutely. All data is isolated per organization using multi-tenant architecture. Passwords are bcrypt-hashed, and all API calls require a valid JWT token over HTTPS." },
    { question: "Can multiple team members use the system simultaneously?", answer: "Yes. The admin can create editor accounts and assign specific permissions to each. All users work in real-time from the same shared database." },
    { question: "How does email notification work?", answer: "You configure your own Gmail account in the 'My Account' section using a Gmail App Password. The system then sends emails on your behalf when a lawyer is assigned to a case." },
    { question: "Is there a mobile version?", answer: "The web application is fully responsive and works on mobile browsers. A dedicated mobile app is on the roadmap." },
    { question: "Can I export my data?", answer: "Yes. From the Generate Report page, you can export a full CSV file of all case data at any time." },
    { question: "What is the difference between Admin and Editor?", answer: "Admin has full access to all features including billing, SMTP settings, adding editors, and activity logs. Editors receive a custom subset of permissions configured by the Admin." }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.question}
                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {openIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
