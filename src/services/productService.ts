import api from './api';
import { Product } from '@/app/dashboard/produtos/page';

interface PaginatedResponse<T> {
    items: T[];
    total: number;
}

interface CreateProductRequest {
    name: string;
}

interface UpdateProductRequest {
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
    limit: number,
    sortBy: string = 'name',
    sortOrder: string = 'asc'
): Promise<PaginatedResponse<Product>> => {
    try {
        const skip = (page - 1) * limit;
        const response = await api.get<PaginatedResponse<Product>>('/products', {
            params: { skip, limit, sort_by: sortBy, sort: sortOrder }, 
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
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
        console.error('Error creating product:', error);
        throw error;
    }
};

/**
 * Updates an existing product.
 * @param {number} productId - The ID of the product to update.
 * @param {UpdateProductRequest} productData - The data for the updated product.
 * @returns {Promise<Product>} - The updated product.
 */
export const updateProduct = async (
    productId: number,
    productData: UpdateProductRequest
): Promise<Product> => {
    try {
        const response = await api.put<Product>(`/products/${productId}`, productData);
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
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

