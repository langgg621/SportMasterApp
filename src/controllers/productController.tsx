import { apiClient } from './apiClient';
import { Product, ProductSection, ProductSpec, ReviewListResult } from '../models';

export const productController = {
  // Lấy danh sách (có filter, phân trang)
  getAll: async (queryString: string = ''): Promise<{ items: Product[]; total: number }> => {
    const res = await apiClient.get(`/products${queryString ? '?' + queryString : ''}`);
    return res;
  },

  // Lấy sản phẩm theo nhãn (sale, best_price, new_collection...)
  getByFlag: async (flag: string, limit = 10): Promise<Product[]> => {
    const res = await apiClient.get(`/products/flag/${flag}?limit=${limit}`);
    return res.data;
  },

  // Chi tiết sản phẩm
  getDetail: async (id: string): Promise<Product> => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },

  // Sản phẩm liên quan
  getRelated: async (id: string, limit = 10): Promise<Product[]> => {
    const res = await apiClient.get(`/products/${id}/related?limit=${limit}`);
    return res.data;
  },

  // Thông số kỹ thuật
  getSpecs: async (id: string): Promise<ProductSpec[]> => {
    const res = await apiClient.get(`/products/${id}/specs`);
    return res.data;
  },

  // Đánh giá của sản phẩm
  getReviews: async (id: string, page = 1, pageSize = 10): Promise<ReviewListResult> => {
    const res = await apiClient.get(`/reviews/product/${id}?page=${page}&pageSize=${pageSize}`);
    return res;
  }
};