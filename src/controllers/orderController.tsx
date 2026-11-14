import { apiClient } from './apiClient';
import { Order, OrderConfirmation } from '../models/order';

export const orderController = {
  createOrder: async (data: any): Promise<Order> => {
    const res = await apiClient.post('/orders', data);
    return res.data;
  },

  getMyOrders: async (status?: number, page = 1, pageSize = 10): Promise<{ items: Order[]; total: number }> => {
    let query = `?page=${page}&pageSize=${pageSize}`;
    if (status) query += `&status=${status}`;
    const res = await apiClient.get(`/orders${query}`);
    return res;
  },

  getOrderDetail: async (id: string): Promise<Order> => {
    const res = await apiClient.get(`/orders/${id}`);
    return res.data;
  },

  getConfirmation: async (id: string): Promise<OrderConfirmation> => {
    const res = await apiClient.get(`/orders/${id}/confirmation`);
    return res.data;
  },

  cancelOrder: async (id: string): Promise<void> => {
    await apiClient.put(`/orders/${id}/cancel`, {});
  }
};