import { cartAction } from '../actions/cartAction';
import { Cart } from '../models/cartItem';
import { Product } from '../models/product';

export const cartController = {
  // Lấy giỏ hàng hiện tại
  getCartState(): Cart {
    return cartAction.getCart();
  },

  // Thêm sản phẩm vào giỏ
  addProductToCart(product: Product, quantity: number = 1, size?: string, color?: string): Cart {
    return cartAction.addToCart(product, quantity, size, color);
  },

  // Thay đổi số lượng sản phẩm
  changeItemQuantity(cartItemId: string, quantity: number): Cart {
    return cartAction.updateQuantity(cartItemId, quantity);
  },

  // Xóa sản phẩm khỏi giỏ
  removeItem(cartItemId: string): Cart {
    return cartAction.removeFromCart(cartItemId);
  },

  // Xóa toàn bộ giỏ hàng
  clearCurrentCart(): Cart {
    return cartAction.clearCart();
  },
};