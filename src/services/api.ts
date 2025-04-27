import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // envia cookies (session_token)
});

console.log('Effective API Base URL:', api.defaults.baseURL);

function getSessionToken() {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(cookie => cookie.startsWith('session_token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }
  return null;
}

export const setupInterceptors = (setLoading: (loading: boolean) => void) => {
  api.interceptors.request.use(
    (config) => {
      setLoading(true);

      // // Não adicionar Authorization header na rota de login
      // if (config.url !== '/users/login') {
      //   const token = getSessionToken(); 
        
      //   if (token) {
      //     config.headers.Authorization = `Bearer ${token}`;
      //   }
      // }

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
      return response;
    },
    (error) => {
      setLoading(false);
      return Promise.reject(error);
    }
  );
};

export default api;
