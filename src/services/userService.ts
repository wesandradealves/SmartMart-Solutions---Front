import api from './api';

interface LoginResponse {
  message: string;
  token: string;
}

/**
 * Chama o endpoint de login no backend e retorna a resposta do servidor.
 * O token é armazenado em um cookie HttpOnly.
 * @param {string} identifier - E-mail ou nome de usuário.
 * @param {string} password - Senha do usuário.
 * @returns {Promise<LoginResponse>} - Resposta da API com mensagem e token.
 */
export const loginUser = async (identifier: string, password: string): Promise<LoginResponse> => {
  const loginData = identifier.includes('@')
    ? { email: identifier, password }
    : { username: identifier, password };
  try {
    const response = await api.post<LoginResponse>('/users/login', loginData);
    
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
  const response = await api.post<{ message: string }>('/users/logout');
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
  return response.data.message;
};
