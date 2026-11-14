import { apiClient } from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, ProfileMenuItem } from '../models';

export const userController = {
  login: async (email: string, password: string): Promise<{ token: string; data: User }> => {
    const res = await apiClient.post('/users/login', { email, password });
    // Lưu token vào máy
    await AsyncStorage.setItem('@SportMaster:token', res.token);
    return res;
  },

  register: async (data: any): Promise<{ token: string; data: User }> => {
    const res = await apiClient.post('/users/register', data);
    await AsyncStorage.setItem('@SportMaster:token', res.token);
    return res;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get('/users/me');
    return res.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('@SportMaster:token');
  },
  getProfileMenu: async (): Promise<ProfileMenuItem[]> => {
    const res = await apiClient.get('/profile/menu');
    return res.data;
  }
};