import React from 'react';
import './Auth.css';

const Contact = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Contact Sales</h2>
        <p className="auth-subtitle">Get your questions answered by our experts.</p>
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" placeholder="Your name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@firm.com" />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea placeholder="How can we help?" rows="4"></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-100">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
