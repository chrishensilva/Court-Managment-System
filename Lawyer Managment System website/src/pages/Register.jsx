import { useEffect } from 'react';

// This page redirects the user to the real Lawyer Management System register page.
// The system runs on port 5173 with HashRouter, so register is at /#/register
const SYSTEM_URL = 'http://localhost:5173/#/register';

const Register = () => {
  useEffect(() => {
    window.location.href = SYSTEM_URL;
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <p style={{ color: '#71717a', fontSize: '1rem' }}>Redirecting to the system sign up page...</p>
    </div>
  );
};

export default Register;
