// Configuração robusta de API usando variáveis de ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  GERAR_PDF: `${API_BASE_URL}/gerar-pdf`
};

// Log para debug (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('🔧 Configuração da API:', {
    API_BASE_URL,
    API_ENDPOINTS
  });
}

export default API_ENDPOINTS;
