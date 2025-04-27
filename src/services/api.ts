import axios from 'axios';

// Cria uma instância do axios com a URL base da API e configurações padrão
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  
});


// Adiciona o token de autenticação ao cabeçalho Authorization (opcional -- nao implementado) e Gerencia loaders
export const setupInterceptors = (setLoading: (loading: boolean) => void) => {
  api.interceptors.request.use(
    (config) => {
      setLoading(true);
      console.log('loading')
      return config;
    },
    (error) => {
      setLoading(false);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      setLoading(false);
      console.log('!loading')
      return response;
    },
    (error) => {
      setLoading(false);
      return Promise.reject(error);
    }
  );
};

export default api;
