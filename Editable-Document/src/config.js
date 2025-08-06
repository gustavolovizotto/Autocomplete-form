// Detecta ambiente
const isDevelopment = !import.meta.env.PROD;
const isVercel = window.location.hostname.includes('vercel.app');
const isRender = window.location.hostname.includes('onrender.com');

let API_BASE_URL;

if (isDevelopment) {
  // Desenvolvimento local
  API_BASE_URL = 'http://localhost:4000';
} else if (isVercel) {
  // Produção no Vercel (serverless functions)
  API_BASE_URL = '';
} else if (isRender) {
  // Produção no Render (backend separado)
  API_BASE_URL = 'https://receituario-backend.onrender.com';
} else {
  // Fallback
  API_BASE_URL = '';
}

export const API_ENDPOINTS = {
  GERAR_PDF: `${API_BASE_URL}${(isVercel && !isDevelopment) ? '/api' : ''}/gerar-pdf`
};

export default API_ENDPOINTS;
