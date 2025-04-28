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


export const createProduct = async (productData: CreateProductRequest): Promise<Product> => {
    try {
        const response = await api.post<Product>('/products', productData);
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

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

export const deleteProduct = async (productId: number): Promise<void> => {
    try {
        await api.delete(`/products/${productId}`);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};