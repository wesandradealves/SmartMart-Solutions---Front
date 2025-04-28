import { AxiosError } from 'axios';
import api from './api';
import { Product } from '@/app/dashboard/produtos/page';

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
}

interface CreateProductRequest {
    name: string;
}

/**
 * Fetches a paginated list of products.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of items per page.
 * @param {string} sortBy - The field to sort by (e.g., 'id' or 'name').
 * @param {string} sortOrder - The sort order ('asc' or 'desc').
 * @returns {Promise<PaginatedResponse<Product>>} - A paginated response containing products.
 */
export const fetchProducts = async (
    page: number,
    pageSize: number,
    sortField: string,
    sortOrder: string,
    categoryId?: number | null
) => {
    const params: Record<string, string | number | undefined> = {
        page,
        pageSize,
        sort_by: sortField, // Changed from sortField to sort_by
        sort: sortOrder,   // Changed from sortOrder to sort
    };

    if (categoryId) {
        params.category_id = categoryId;
    }

    const response = await api.get('/products', { params });
    return response.data;
};

/**
 * Creates a new product.
 * @param {CreateProductRequest} productData - The data for the new product.
 * @returns {Promise<Product>} - The created product.
 */
export const createProduct = async (productData: CreateProductRequest): Promise<Product> => {
    try {
        const response = await api.post<Product>('/products', productData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response) {
                const errorDetails = error.response.data;
                if (Array.isArray(errorDetails)) {
                    const fieldErrors = errorDetails.map((fieldError: { loc: string[]; msg: string }) => {
                        const fieldPath = fieldError.loc.join(' -> ');
                        return `${fieldPath}: ${fieldError.msg}`;
                    }).join('\n');
                    throw new Error(fieldErrors);
                }
                const errorMessage = errorDetails?.detail || 'Erro desconhecido ao criar o produto';
                throw new Error(errorMessage);
            } else if (error.request) {
                console.error('API Error Request:', error.request);
                throw new Error('Nenhuma resposta recebida do servidor');
            } else {
                console.error('API Error Message:', error.message);
                throw new Error(error.message);
            }
        } else {
            console.error('Unexpected Error:', error);
            throw new Error('Erro inesperado ao criar o produto');
        }
    }
};

/**
 * Updates an existing product.
 * @param {number} productId - The ID of the product to update.
 * @returns {Promise<Product>} - The updated product.
 */
export const updateProduct = async (
    productId: number,
    productData: Partial<{ name: string; description: string; price: number; category_id: number; brand: string }>
): Promise<Product> => {
    if (Object.keys(productData).length === 0) {
        throw new Error('Nenhum dado foi fornecido para atualização.');
    }

    try {
        const response = await api.put<Product>(`/products/${productId}`, productData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.data && Array.isArray(error.response.data)) {
                const errorMessages = error.response.data.map((err: { msg: string }) => err.msg);
                console.error('API error:', errorMessages.join(', '));
                throw new Error(errorMessages.join(', ')); 
            }
            console.error('API error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Erro desconhecido ao atualizar o produto');
        } else {
            console.error('Unexpected error:', error);
            throw new Error('Erro inesperado ao atualizar o produto');
        }
    }
};

/**
 * Deletes a product.
 * @param {number} productId - The ID of the product to delete.
 * @returns {Promise<void>} - A promise that resolves when the product is deleted.
 */
export const deleteProduct = async (productId: number): Promise<void> => {
    try {
        await api.delete(`/products/${productId}`);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

/**
 * Updates the discount percentage for a product category.
 * @param {number} categoryId - The ID of the category to update.
 * @param {number} discountPercentage - The new discount percentage (0-100).
 * @returns {Promise<{ success: boolean; message: string; discount_percentage: number; category_id: number; updated_products: any[] }>} - The response data.
 */
export const updateProductDiscount = async (
    categoryId: number,
    discountPercentage: number
): Promise<{
  success: boolean;
  message: string;
  discount_percentage: number;
  category_id: number;
  updated_products: Product[]; 
}> => {
    if (discountPercentage < 0 || discountPercentage > 100) {
        throw new Error('O desconto deve estar entre 0 e 100.');
    }

    try {
        const response = await api.put(`/products/categories/${categoryId}/discount?discount_percentage=${discountPercentage}`);
        return response.data;
    } catch (error) {
        console.error('Error updating product discount:', error);
        throw error;
    }
};

