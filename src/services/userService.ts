import api from './api';
import { PaginatedResponse } from './productService';
import axios from 'axios';

interface LoginResponse {
  message: string;
  token: string;
}

/**
 * Representa um usuário no sistema.
 */
export interface User {
  id: number;
  name: string; // Added name field
  email: string;
  username: string;
  role: "admin" | "viewer";
  password?: string;
  created_at: string;
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

/**
 * Lista os usuários com paginação e ordenação.
 * @param {number} page - Número da página.
 * @param {number} pageSize - Tamanho da página.
 * @param {string} sortBy - Campo para ordenar.
 * @param {string} sortOrder - Ordem de classificação (asc ou desc).
 * @returns {Promise<PaginatedResponse<User>>} - Lista paginada de usuários.
 */
export const fetchUsers = async (
  page: number,
  pageSize: number,
  role: string | null = null,
  sortBy: string = 'username',
  sortOrder: string = 'asc'
): Promise<PaginatedResponse<User>> => {
  try {
    const response = await api.get<PaginatedResponse<User>>('/users', {
      params: {
        skip: (page - 1) * pageSize,
        limit: pageSize,
        role: role || undefined, // Include role filter if provided
        sort_by: sortBy,
        sort: sortOrder,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Atualiza os dados de um usuário.
 * @param {number} userId - ID do usuário a ser atualizado.
 * @param {Partial<User>} userData - Dados atualizados do usuário.
 * @returns {Promise<User>} - Usuário atualizado.
 */
export const updateUser = async (
  userId: number,
  userData: Partial<User>
): Promise<User> => {
  try {
    const response = await api.put<User>(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Deleta um usuário pelo ID.
 * @param {number} userId - ID do usuário a ser deletado.
 * @returns {Promise<void>} - Promessa resolvida quando o usuário for deletado.
 */
export const deleteUser = async (userId: number): Promise<void> => {
  try {
    await api.delete(`/users/${userId}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Busca os roles disponíveis no sistema.
 * @returns {Promise<string[]>} - Lista de roles.
 */
export const fetchRoles = async (): Promise<string[]> => {
  try {
    const response = await api.get<string[]>('/users/roles');
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const createUser = async (userData: User) => {
  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erro ao criar usuário');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Erro desconhecido ao criar usuário');
    }
  }
};



