// In Vercel (or split hosting), VITE_API_BASE_URL points to the external Render API.
// If both are hosted together, it defaults to relative '/api'.
// In dev (npm run dev), it defaults to localhost:5000.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
    || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
export default API_BASE_URL;

