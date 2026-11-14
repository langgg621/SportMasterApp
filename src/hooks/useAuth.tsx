import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userController } from '../controllers/userController';
import { User } from '../models/user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin user từ API (nếu có token)
  const fetchUser = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('@SportMaster:token');
      if (!token) {
        setUser(null);
        return;
      }
      const data = await userController.getMe();
      setUser(data);
    } catch (error) {
      console.log('Chưa đăng nhập hoặc token hết hạn');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Hàm Đăng nhập
  const login = async (email: string, pass: string) => {
    const res = await userController.login(email, pass);
    setUser(res.data);
  };

  // Hàm Đăng xuất
  const logout = async () => {
    await userController.logout();
    setUser(null);
  };
  // Thêm vào trong useAuth
  const register = async (data: any) => {
    const res = await userController.register(data);
    setUser(res.data);};
  return { user, loading, register,login, logout, refreshUser: fetchUser };
};