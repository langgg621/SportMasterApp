import { apiClient } from './apiClient';
import { Banner, CatalogSection, Product } from '../models';

export const homeController = {
  // Lấy banner trang chủ
  getBanners: async (type?: number): Promise<Banner[]> => {
    const url = type ? `/banners?type=${type}` : '/banners';
    const res = await apiClient.get(url);
    return res.data;
  },

  // Lấy các khối danh mục (Giới tính, Môn thể thao)
  getCatalogSections: async (): Promise<CatalogSection[]> => {
    const res = await apiClient.get('/catalog/sections');
    return res.data;
  },

  // Lấy Flash Sale (Daily Deals)
  getDailyDeals: async (limit = 10): Promise<Product[]> => {
    const res = await apiClient.get(`/banners/daily-deals?limit=${limit}`);
    return res.data;
  }
};