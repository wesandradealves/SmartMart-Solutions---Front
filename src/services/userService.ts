import api from './api';

interface LoginResponse {
  message: string;
  token: string;
}

export const loginUser = async (identifier: string, password: string): Promise<LoginResponse> => {
  // Determina se o identificador é um e-mail ou nome de usuário
  const loginData = identifier.includes('@')
    ? { email: identifier, password }
    : { username: identifier, password };
  console.log('Attempting login via userService with:', loginData);
  console.log('Target URL:', api.defaults.baseURL + '/users/login'); // Log URL completa
  try {
    const response = await api.post<LoginResponse>('/users/login', loginData);
    console.log('Login API Response:', response);
    
    if (typeof window !== 'undefined') {
      document.cookie = `session_token=${response.data.token}; path=/; max-age=3600;`;
    }
    return response.data;
  } catch (error) {
    console.error('Error during login API call:', error);
    throw error; 
  }
};

/**
 * Chama o endpoint de logout no backend e retorna a mensagem do servidor.
 * Remove o token e dados do usuário localmente.
 */
export const logoutUser = async (): Promise<string> => {
  // Chama endpoint para remover cookie HttpOnly e obter mensagem
  const response = await api.post<{ message: string }>('/users/logout');
  if (typeof window !== 'undefined') {
    // Limpa dados locais
    localStorage.removeItem('user');
  }
  return response.data.message;
};
