import axios from 'axios';

// Cria uma instância customizada do Axios
const api = axios.create({
  // A baseURL será colocada automaticamente na frente de todas as suas requisições.
  // Substitua pela forma como você lê suas variáveis de ambiente (VUE_APP_ ou VITE_)
  baseURL: process.env.VUE_APP_API_URL || 'https://medclin-api.onrender.com/api',
  
  // Opcional: define um tempo limite para a requisição não ficar travada para sempre
  timeout: 10000, 
});

export default api;