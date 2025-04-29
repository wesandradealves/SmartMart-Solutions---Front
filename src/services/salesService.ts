import { AxiosError } from 'axios';
import api from './api';

export interface SaleWithProductName {
    id: number;
    product_id: number;
    quantity: number;
    total_price: number;
    date: string;
    product_name: string;
}

export const fetchSales = async (
    page: number,
    pageSize: number,
    sortBy: string,
    sortOrder: string,
    productId?: number | null
): Promise<{ items: SaleWithProductName[]; total: number }> => {
    const skip = (page - 1) * pageSize;
    const params: Record<string, string | number | undefined> = {
        skip,
        limit: pageSize,
        sort_by: sortBy,
        sort_order: sortOrder,
    };
    if (productId) {
        params.product_id = productId;
    }
    const response = await api.get<{ items: SaleWithProductName[]; total: number }>('/sales', { params });
    return response.data;
};

export const createSale = async (sale: Omit<SaleWithProductName, 'id' | 'product_name'>): Promise<SaleWithProductName> => {
    const response = await api.post<SaleWithProductName>('/sales', sale);
    return response.data;
};

interface ApiErrorResponse {
  detail?: string;
  [key: string]: unknown;
}

export const updateSale = async (saleId: number, sale: Partial<SaleWithProductName>): Promise<{ message: string; sale: SaleWithProductName }> => {
    try {
        const response = await api.put<{ message: string; sale: SaleWithProductName }>(`/sales/${saleId}`, sale);
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            const err = error as AxiosError;
            console.error('API error:', err.response?.data);
            throw new Error(
                (err.response?.data as ApiErrorResponse)?.detail ||
                (typeof err.response?.data === 'string' ? err.response.data : 'Erro desconhecido ao atualizar venda')
            );
        } else if (error && typeof error === 'object' && 'request' in error) {
            const err = error as AxiosError;
            console.error('API Error Request:', err.request);
            throw new Error('Nenhuma resposta recebida do servidor');
        } else if (error instanceof Error) {
            console.error('API Error Message:', error.message);
            throw new Error(error.message);
        } else {
            throw new Error('Erro desconhecido ao atualizar venda');
        }
    }
};

export const deleteSale = async (saleId: number): Promise<void> => {
    await api.delete(`/sales/${saleId}`);
};

export const exportSalesCSV = async (): Promise<void> => {
    const response = await api.get('/sales/export', {
        responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sales.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export const importSalesCSV = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/sales/upload-csv', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.message;
};