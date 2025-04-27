 
import api from './api';

interface ApiError {
  response?: {
    data?: unknown;
  };
}

// Login 

export const Login = async (username: string, password: string) => {
  try {
    const response = await api.post('/jwt-auth/v1/token', {
      username,
      password,
    });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error && 'response' in error) {
      const apiError = error as ApiError;
      console.error('Login Error:', apiError.response?.data || error.message);
    } else {
      console.error('Login Error:', error);
    }
    throw error;
  }
};

// Get User

export const getUser = async (id: number = 1) => {
  try {
    const response = await api.get(`/wp/v2/users/${id}?context=view`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
};