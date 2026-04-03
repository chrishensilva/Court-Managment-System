import React from 'react';

const WhoIsItFor = () => {
  return (
    <section className="section bg-gray-50">
      <div className="container">
        <h2 className="section-title">Built for Every Role in Your Legal Team</h2>
        <p className="section-subtitle">Court CMS adapts to exactly what you need to do, no matter your role.</p>

        <div className="table-responsive" style={{overflowX: 'auto', marginTop: '2rem'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)'}}>
            <thead>
              <tr style={{backgroundColor: 'var(--color-primary)', color: '#fff', textAlign: 'left'}}>
                <th style={{padding: '1.5rem', width: '30%'}}>User</th>
                <th style={{padding: '1.5rem'}}>How It Helps</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{borderBottom: '1px solid var(--color-gray-200)'}}>
                <td style={{padding: '1.5rem', fontWeight: '600'}}>Law Firm Administrators</td>
                <td style={{padding: '1.5rem', color: 'var(--color-gray-500)'}}>Full visibility, team control, billing, and audit logs</td>
              </tr>
              <tr style={{borderBottom: '1px solid var(--color-gray-200)'}}>
                <td style={{padding: '1.5rem', fontWeight: '600'}}>Senior Lawyers</td>
                <td style={{padding: '1.5rem', color: 'var(--color-gray-500)'}}>Manage their own caseload and client information</td>
              </tr>
              <tr style={{borderBottom: '1px solid var(--color-gray-200)'}}>
                <td style={{padding: '1.5rem', fontWeight: '600'}}>Junior / Associate Lawyers</td>
                <td style={{padding: '1.5rem', color: 'var(--color-gray-500)'}}>View assigned cases, check upcoming hearings</td>
              </tr>
              <tr style={{borderBottom: '1px solid var(--color-gray-200)'}}>
                <td style={{padding: '1.5rem', fontWeight: '600'}}>Legal Secretaries / Clerks</td>
                <td style={{padding: '1.5rem', color: 'var(--color-gray-500)'}}>Add new cases and clients, update court dates</td>
              </tr>
              <tr>
                <td style={{padding: '1.5rem', fontWeight: '600'}}>Office Managers</td>
                <td style={{padding: '1.5rem', color: 'var(--color-gray-500)'}}>Generate reports, track firm performance</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default WhoIsItFor;
