// Detecta ambiente
const isDevelopment = !import.meta.env.PROD;
const isRenderFrontend = window.location.hostname.includes('onrender.com');

let API_BASE_URL;

if (isDevelopment) {
  // Desenvolvimento local
  API_BASE_URL = 'http://localhost:4000';
} else if (isRenderFrontend) {
  // Produção no Render (frontend + backend separados)
  API_BASE_URL = 'https://receituario-backend.onrender.com';
} else {
  // Outros ambientes (Vercel, Netlify, etc.)
  API_BASE_URL = '';
}

export const API_ENDPOINTS = {
  GERAR_PDF: `${API_BASE_URL}${(!isDevelopment && !isRenderFrontend) ? '/api' : ''}/gerar-pdf`
};

export default API_ENDPOINTS;
