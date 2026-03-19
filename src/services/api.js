import axios from 'axios';

// Cria uma instância customizada do Axios
const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'https://medclin-api.onrender.com/api',
  
  // Define um tempo limite para a requisição não ficar travada para sempre
  timeout: 10000, 
});

export default api;