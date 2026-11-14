import { apiClient } from './apiClient';
import { PickupPoint } from '../models';

export const pickupPointController = {
  // Lấy toàn bộ điểm nhận hàng
  getAll: async (): Promise<PickupPoint[]> => {
    const res = await apiClient.get('/pickup-points');
    return res.data;
  },

  // Lấy chi tiết 1 điểm
  getById: async (id: string): Promise<PickupPoint> => {
    const res = await apiClient.get(`/pickup-points/${id}`);
    return res.data;
  }
};