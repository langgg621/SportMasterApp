import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userController } from '../controllers/userController';
import { User } from '../models';

// Biến toàn cục để lưu user và các hàm lắng nghe
let globalUser: User | null = null;
let listeners: ((state: User | null) => void)[] = [];

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(globalUser);
  const [loading, setLoading] = useState(true);

  // Đăng ký lắng nghe sự thay đổi
  useEffect(() => {
    const listener = (newState: User | null) => setUser(newState);
    listeners.push(listener);
    
    // Nếu globalUser chưa có, tức là app vừa mở lên -> Gọi API check token
    if (globalUser === null) {
      fetchUser();
    } else {
      setLoading(false);
    }

    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const updateGlobalUser = (newUser: User | null) => {
    globalUser = newUser;
    listeners.forEach(listener => listener(newUser));
  };

  const fetchUser = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('@SportMaster:token');
      if (!token) {
        updateGlobalUser(null);
        return;
      }
      const data = await userController.getMe();
      updateGlobalUser(data);
    } catch (error) {
      updateGlobalUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cập nhật hàm login để lưu token và đổi state
  const login = async (email: string, pass: string) => {
    const res = await userController.login(email, pass);
    // res.data là thông tin user từ API trả về
    updateGlobalUser(res.data); 
  };

  const logout = async () => {
    await userController.logout();
    updateGlobalUser(null);
  };
  const register = async (data: any)=>{
    const res= await userController.register(data);
    updateGlobalUser(res.data);

  }
  return { user, loading, login, register, logout, refreshUser: fetchUser };
};