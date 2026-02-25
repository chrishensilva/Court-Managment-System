// In production, the Express server serves both frontend & API on the same host.
// In dev (npm run dev), Vite runs on :5173 and server on :5000.
const API_BASE_URL = import.meta.env.PROD
    ? '/api'
    : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api');

export default API_BASE_URL;

