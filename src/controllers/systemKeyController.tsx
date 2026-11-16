import { apiClient } from './apiClient';
import { SystemKey } from '../models/systemKey';

export const systemKeyController = {
  // Lấy các nhóm (ít dùng)
  getAllGroups: async (): Promise<SystemKey[]> => {
    const res = await apiClient.get('/system-keys/groups');
    return res.data;
  },

  // Lấy danh sách theo ParentID (VD: parentId = 10 là Phương thức thanh toán)
  getByParentID: async (parentId: number): Promise<SystemKey[]> => {
    const res = await apiClient.get(`/system-keys?parentId=${parentId}`);
    return res.data;
  }
};