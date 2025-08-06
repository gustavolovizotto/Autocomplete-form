// Detecta se está rodando em desenvolvimento (local) ou produção (Vercel)
const isProduction = import.meta.env.PROD;

const API_BASE_URL = isProduction 
  ? '' // Em produção (Vercel), usa URL relativa
  : 'http://localhost:4000'; // Em desenvolvimento, usa localhost

export const API_ENDPOINTS = {
  GERAR_PDF: `${API_BASE_URL}${isProduction ? '/api' : ''}/gerar-pdf`
};

export default API_ENDPOINTS;
