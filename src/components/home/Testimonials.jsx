import React from 'react';

const Testimonials = () => {
  return (
    <section className="section bg-gray-50">
      <div className="container">
        <h2 className="section-title">What Legal Teams Say About Court CMS</h2>
        <p className="section-subtitle">Join the growing number of practices upgrading their management.</p>

        <div className="testimonials-grid">
          
          <div className="testimonial-card">
            <p className="testimonial-quote">"Court CMS completely replaced our spreadsheet chaos. We now assign lawyers in seconds and never miss a hearing date."</p>
            <div className="testimonial-author">— Partner, ABC Law Firm</div>
          </div>

          <div className="testimonial-card">
            <p className="testimonial-quote">"The automated email notifications alone saved us hours every week. Our lawyers always know their new assignments instantly."</p>
            <div className="testimonial-author">— Office Manager, XYZ Legal Associates</div>
          </div>

          <div className="testimonial-card">
            <p className="testimonial-quote">"The role-based access control is exactly what we needed. Our clerks have access to what they need, and nothing more."</p>
            <div className="testimonial-author">— Senior Advocate, City Court Practice</div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
