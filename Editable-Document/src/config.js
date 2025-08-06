// Detecta ambiente
const isDevelopment = !import.meta.env.PROD;

let API_BASE_URL;

if (isDevelopment) {
  // Desenvolvimento local
  API_BASE_URL = 'http://localhost:4000';
} else {
  // Produção (Vercel frontend + Render backend)
  API_BASE_URL = 'https://receituario-backend.onrender.com';
}

export const API_ENDPOINTS = {
  GERAR_PDF: `${API_BASE_URL}/gerar-pdf`
};

export default API_ENDPOINTS;
