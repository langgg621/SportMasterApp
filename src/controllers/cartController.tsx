import { INITIAL_CART,PAYMENT_METHODS } from '../data/mockData';
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
      const cleanPrice = parseInt(String(item?.product?.price || '0').replace(/[^0-9]/g, ''), 10) || 0;
      return sum + cleanPrice * item.quantity;
    }, 0);
  },
  getPaymentMethod(){
    return PAYMENT_METHODS;
  },
  calculateSelectedTotal(selectedItems: { [key: string]: boolean }) {
    const currentCart = cartController.getCartState() || { items: [] };
    
    let totalSelectedPrice = 0;
    let totalOldPrice = 0;
    let selectedCount = 0;

    currentCart.items.forEach((item: any) => {
      if (selectedItems[item.id]) {
        selectedCount += (item.quantity || 1);
        const cleanPrice = parseInt(String(item?.product?.price || '0').replace(/[^0-9]/g, ''), 10) || 0;
        totalSelectedPrice += cleanPrice * (item?.quantity || 1);

        const rawOld = item?.product?.oldPrice || item?.product?.price || '0';
        const cleanOldPrice = parseInt(String(rawOld).replace(/[^0-9]/g, ''), 10) || 0;
        totalOldPrice += cleanOldPrice * (item?.quantity || 1);
      }
    });

    return {
      selectedCount,
      totalSelectedPrice,
      totalOldPrice,
    };
  },
};