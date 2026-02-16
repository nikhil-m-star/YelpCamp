// API Configuration
// Uses environment variable for backend URL or defaults to localhost
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export default API;
