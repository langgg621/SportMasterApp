import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cartController } from '../controllers/cartController';
import { CartItem } from '../models';

// Một biến lưu trữ toàn cục (Singleton) để tất cả các màn hình dùng chung 1 state giỏ hàng
let globalCartState: CartItem[] = [];
let listeners: ((state: CartItem[]) => void)[] = [];

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>(globalCartState);
  const [loading, setLoading] = useState(false);

  // Đăng ký lắng nghe sự thay đổi của giỏ hàng toàn cục
  useEffect(() => {
    const listener = (newState: CartItem[]) => setItems(newState);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  // Hàm cập nhật state cho tất cả các component đang dùng
  const updateGlobalCart = (newItems: CartItem[]) => {
    globalCartState = newItems;
    listeners.forEach(listener => listener(newItems));
  };

  // 1. Lấy giỏ hàng từ API
    const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. KIỂM TRA TOKEN TRƯỚC KHI GỌI API
      const token = await AsyncStorage.getItem('@SportMaster:token');
      if (!token) {
        updateGlobalCart([]); // Nếu không có token -> Giỏ hàng rỗng
        return; 
      }

      // 2. Nếu có token -> Gọi API
      const data = await cartController.getCart();
      updateGlobalCart(data);
    } catch (error) {
      console.error('Lỗi lấy giỏ hàng:', error);
      updateGlobalCart([]); // Nếu lỗi (vd: token hết hạn) cũng reset về rỗng
    } finally {
      setLoading(false);
    }
  }, []);

  // Tự động fetch giỏ hàng khi app vừa mở lên
  useEffect(() => {
    if (globalCartState.length === 0) {
      fetchCart();
    }
  }, [fetchCart]);

  // 2. Thêm vào giỏ hàng
  const addToCart = async (productId: string, sizeId: string, colorId: string | null, quantity: number = 1) => {
    try {
      setLoading(true);
      // Gọi API thật, Backend sẽ trả về list giỏ hàng mới
      const newCart = await cartController.addToCart(productId, sizeId, colorId, quantity);
      updateGlobalCart(newCart);
      return true; // Trả về true để UI biết là đã thêm thành công
    } catch (error: any) {
      throw new Error(error.message); // Ném lỗi tiếng Nga (vd: OUT_OF_STOCK) cho UI bắt
    } finally {
      setLoading(false);
    }
  };

  // 3. Cập nhật số lượng (+ / -)
  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      const newCart = await cartController.updateQuantity(cartItemId, quantity);
      updateGlobalCart(newCart);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  // 4. Xóa 1 món
  const removeItem = async (cartItemId: string) => {
    try {
      const newCart = await cartController.removeItem(cartItemId);
      updateGlobalCart(newCart);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  // 5. Xóa sạch giỏ
  const clearCart = async () => {
    try {
      await cartController.clearCart();
      updateGlobalCart([]);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  // Tính tổng số lượng món đồ (để hiện Badge đỏ)
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    totalCount,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
};