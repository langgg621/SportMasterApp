import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { cartController } from '../controllers/cartController';

export function useCart() {
  const [totalCount, setTotalCartCount] = useState(0);

  const refresh = useCallback(() => {
    const cartState = cartController.getCartState();
    setTotalCartCount(cartState?.totalItems || 0);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  // Thêm hàm wrapper để tiện gọi và tự refresh ngay lập tức
  const addToCart = (product: any, quantity = 1, size?: string, color?: string) => {
    cartController.addProductToCart(product, quantity, size, color);
    refresh(); // Cập nhật state ngay lập tức cho màn hình hiện tại
  };

  return {
    totalCount,
    addToCart,
    refresh,
  };
}