import { apiClient } from './apiClient';
import { Category, Brand, Color, Collection } from '../models';

export const catalogController = {
  getCategories: async (): Promise<Category[]> => {
    const res = await apiClient.get('/catalog/categories');
    return res.data;
  },

  getBrands: async (): Promise<Brand[]> => {
    const res = await apiClient.get('/catalog/brands');
    return res.data;
  },

  getColors: async (): Promise<Color[]> => {
    const res = await apiClient.get('/catalog/colors');
    return res.data;
  },

  getCollections: async (): Promise<Collection[]> => {
    const res = await apiClient.get('/catalog/collections');
    return res.data;
  }
};