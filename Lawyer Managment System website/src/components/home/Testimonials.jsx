import React from 'react';
import { Quote } from 'lucide-react';
import './Home.css';

const testimonials = [
  {
    quote: "Court CMS completely replaced our spreadsheet chaos. We now assign lawyers in seconds and never miss a hearing date.",
    author: "Partner, ABC Law Firm"
  },
  {
    quote: "The automated email notifications alone saved us hours every week. Our lawyers always know their new assignments instantly.",
    author: "Office Manager, XYZ Legal Associates"
  },
  {
    quote: "The role-based access control is exactly what we needed. Our clerks have access to what they need, and nothing more.",
    author: "Senior Advocate, City Court Practice"
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="section-title">What Legal Teams Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div className="testimonial-card" key={idx}>
              <Quote className="quote-icon" size={32} color="var(--color-gray-300)" />
              <p className="quote-text">"{t.quote}"</p>
              <div className="quote-author">- {t.author}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
