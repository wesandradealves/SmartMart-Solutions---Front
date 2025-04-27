import api from './api';

interface UserResponse {
    email: string;
    username: string;
    role: string;
    created_at: string;
}

interface UpdateUserRequest {
    email?: string;
    username?: string;
    password?: string;
    role?: string;
}

/**
 * Atualiza os dados do usuário logado.
 * @param {UpdateUserRequest} userData - Dados a serem atualizados.
 * @returns {Promise<UserResponse>} - Dados atualizados do usuário.
 */
export const updateMyAccount = async (userId: number, userData: UpdateUserRequest): Promise<UserResponse> => {
    try {
        const filteredData = Object.fromEntries(
            Object.entries(userData).filter(([, value]) => value !== undefined)
        );

        const response = await api.put<UserResponse>(`/users/${userId}`, filteredData);

        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        throw error;
    }
};
