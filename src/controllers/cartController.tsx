import { apiClient } from './apiClient';
import { CartItem } from '../models';

export const cartController = {
  getCart: async (): Promise<CartItem[]> => {
    const res = await apiClient.get('/cart');
    return res.data;
  },

  getCount: async (): Promise<number> => {
    const res = await apiClient.get('/cart/count');
    return res.data;
  },

  addToCart: async (productId: string, sizeId: string, colorId: string | null, quantity = 1): Promise<CartItem[]> => {
    const res = await apiClient.post('/cart', { productId, sizeId, colorId, quantity });
    return res.data; // Trả về list giỏ hàng mới
  },

  updateQuantity: async (cartItemId: string, quantity: number): Promise<CartItem[]> => {
    const res = await apiClient.put(`/cart/${cartItemId}`, { quantity });
    return res.data;
  },

  removeItem: async (cartItemId: string): Promise<CartItem[]> => {
    const res = await apiClient.delete(`/cart/${cartItemId}`);
    return res.data;
  },

  clearCart: async (): Promise<boolean> => {
    const res = await apiClient.delete('/cart');
    return res.success;
  }
};