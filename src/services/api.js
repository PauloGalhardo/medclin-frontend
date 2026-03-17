// frontend/src/services/api.js
import axios from 'axios';

// Cria uma instância do axios com a URL base do nosso backend
const api = axios.create({
  // O Vue identifica sozinho se deve usar a URL de dev ou prod
  baseURL: process.env.VUE_APP_API_URL || 'https://medclin-api.onrender.com'
});

// Interceptor: Antes de qualquer requisição sair do frontend, ele roda essa função
api.interceptors.request.use((config) => {
  // Busca o token que salvaremos no LocalStorage do navegador após o login
  const token = localStorage.getItem('token');
  
  // Se o token existir, coloca no cabeçalho de Autorização
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;