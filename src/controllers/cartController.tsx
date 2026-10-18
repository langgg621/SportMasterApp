import { INITIAL_CART } from '../data/mockData';
import { Cart, CartItem } from '../models/cartItem';
import { Product } from '../models/product';

// Biến lưu trữ state giỏ hàng local mô phỏng bộ nhớ
let currentCart: Cart = { ...INITIAL_CART };

export const cartController = {
  getCartState(): Cart {
    return currentCart;
  },

  addProductToCart(product: Product, quantity: number = 1, selectedSize?: string, selectedColor?: string): Cart {
    const existingIndex = currentCart.items.findIndex(
      item => item.productId === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
    );

    if (existingIndex > -1) {
      currentCart.items[existingIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: `ci_${Date.now()}`,
        productId: product.id,
        product,
        quantity,
        selectedSize,
        selectedColor,
      };
      currentCart.items.push(newItem);
    }

    this.recalculateCart();
    return currentCart;
  },

  changeItemQuantity(cartItemId: string, quantity: number): Cart {
    const item = currentCart.items.find(i => i.id === cartItemId);
    if (item) {
      if (quantity <= 0) {
        return this.removeItem(cartItemId);
      }
      item.quantity = quantity;
    }
    this.recalculateCart();
    return currentCart;
  },

  removeItem(cartItemId: string): Cart {
    currentCart.items = currentCart.items.filter(i => i.id !== cartItemId);
    this.recalculateCart();
    return currentCart;
  },

  clearCurrentCart(): Cart {
    currentCart = { items: [], totalItems: 0, totalAmount: 0 };
    return currentCart;
  },

  recalculateCart() {
    currentCart.totalItems = currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
    currentCart.totalAmount = currentCart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  }
};