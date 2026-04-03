import React from 'react';

const Contact = () => {
  return (
    <div className="page-wrapper section">
      <div className="container" style={{maxWidth: '600px', margin: '0 auto'}}>
        <h2 className="section-title">Contact Us</h2>
        <p className="section-subtitle">Reach out our team for Enterprise pricing and custom support.</p>
        <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <input type="text" placeholder="Name" style={{padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-gray-200)'}} />
          <input type="email" placeholder="Email" style={{padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-gray-200)'}} />
          <textarea rows="5" placeholder="Message" style={{padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-gray-200)'}}></textarea>
          <button type="button" className="btn btn-primary" style={{alignSelf: 'flex-start'}}>Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
