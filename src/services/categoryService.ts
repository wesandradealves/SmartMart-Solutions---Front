import api from './api';

interface Category {
    id: number;
    name: string;
}

interface PaginatedResponse<T> {
    items: T[];
    total: number;
}

interface CreateCategoryRequest {
    name: string;
}

interface UpdateCategoryRequest {
    name: string;
}

/**
 * Fetches a paginated list of categories.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of items per page.
 * @param {string} sortBy - The field to sort by (e.g., 'id' or 'name').
 * @param {string} sortOrder - The sort order ('asc' or 'desc').
 * @returns {Promise<PaginatedResponse<Category>>} - A paginated response containing categories.
 */
export const fetchCategories = async (
    page: number,
    limit: number,
    sortBy: string = 'name',
    sortOrder: string = 'asc'
): Promise<PaginatedResponse<Category>> => {
    try {
        const skip = (page - 1) * limit;
        const response = await api.get<PaginatedResponse<Category>>('/categories', {
            params: { skip, limit, sort_by: sortBy, sort_order: sortOrder },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

/**
 * Creates a new category.
 * @param {CreateCategoryRequest} categoryData - The data for the new category.
 * @returns {Promise<Category>} - The created category.
 */
export const createCategory = async (categoryData: CreateCategoryRequest): Promise<Category> => {
    try {
        const response = await api.post<Category>('/categories', categoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

/**
 * Updates an existing category.
 * @param {number} categoryId - The ID of the category to update.
 * @param {UpdateCategoryRequest} categoryData - The updated data for the category.
 * @returns {Promise<Category>} - The updated category.
 */
export const updateCategory = async (
    categoryId: number,
    categoryData: UpdateCategoryRequest
): Promise<Category> => {
    try {
        const response = await api.put<Category>(`/categories/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

/**
 * Deletes a category.
 * @param {number} categoryId - The ID of the category to delete.
 * @returns {Promise<void>} - Resolves when the category is deleted.
 */
export const deleteCategory = async (categoryId: number): Promise<void> => {
    try {
        await api.delete(`/categories/${categoryId}`);
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};