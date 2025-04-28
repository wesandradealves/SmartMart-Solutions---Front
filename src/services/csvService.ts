import api from './api';

/**
 * Exports products as a CSV file.
 * @returns {Promise<void>} - Resolves when the file is downloaded.
 */
export const exportProductsCSV = async (): Promise<void> => {
    try {
        const response = await api.get('/export/products', {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'products.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error exporting products:', error);
        throw error;
    }
};

/**
 * Imports products from a CSV file.
 * @param {File} file - The CSV file to upload.
 * @returns {Promise<string>} - A success message.
 */
export const importProductsCSV = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post('/products/upload-csv', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.message;
    } catch (error) {
        console.error('Error importing products:', error);
        throw error;
    }
};

/**
 * Exports categories as a CSV file.
 * @returns {Promise<void>} - Resolves when the file is downloaded.
 */
export const exportCategoriesCSV = async (): Promise<void> => {
    try {
        const response = await api.get('/export/categories', {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'categories.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error exporting categories:', error);
        throw error;
    }
};

/**
 * Imports categories from a CSV file.
 * @param {File} file - The CSV file to upload.
 * @returns {Promise<string>} - A success message.
 */
export const importCategoriesCSV = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post('/categories/upload-csv', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.message;
    } catch (error) {
        console.error('Error importing categories:', error);
        throw error;
    }
};

/**
 * Exports sales as a CSV file.
 * @returns {Promise<void>} - Resolves when the file is downloaded.
 */
export const exportSalesCSV = async (): Promise<void> => {
    try {
        const response = await api.get('/export/sales', {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'sales.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error exporting sales:', error);
        throw error;
    }
};

/**
 * Exports users as a CSV file.
 * @returns {Promise<void>} - Resolves when the file is downloaded.
 */
export const exportUsersCSV = async (): Promise<void> => {
    try {
        const response = await api.get('/export/users', {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'users.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error exporting users:', error);
        throw error;
    }
};

/**
 * Exports sales with profit as a CSV file.
 * @returns {Promise<void>} - Resolves when the file is downloaded.
 */
export const exportSalesWithProfitCSV = async (): Promise<void> => {
    try {
        const response = await api.get('/export/sales_with_profit', {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'sales_with_profit.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error exporting sales with profit:', error);
        throw error;
    }
};

/**
 * Imports users from a CSV file.
 * @param {File} file - The CSV file to upload.
 * @returns {Promise<string>} - A success message.
 */
export const importUsersCSV = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post('/users/upload-csv', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.message;
    } catch (error) {
        console.error('Error importing users:', error);
        throw error;
    }
};