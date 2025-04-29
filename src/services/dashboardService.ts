import { AxiosError } from "axios";
import api from './api';

export const fetchSales = async () => {
  const response = await api.get('/sales');
  return response.data.items;
};

export const fetchProfit = async (days?: number) => {
  const response = await api.get('/sales/profit/total', {
    params: { days: days ?? 365 },
  });
  return response.data.sales;
};

export const fetchPriceHistory = async (productId: number) => {
    try {
      const response = await api.get(`/price-history/${productId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.detail || "Erro ao buscar o histórico de preços.";
        throw new Error(errorMessage);
      }
      throw new Error("Erro desconhecido ao buscar o histórico de preços.");
    }
  };