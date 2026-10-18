import { Cart, CartItem } from '../models/cartItem';
import { Product } from '../models/product';

// Trạng thái giỏ hàng lưu trữ tạm thời trong bộ nhớ (In-memory state)
let currentCart: Cart = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

// Hàm nội bộ tính toán lại tổng số lượng và tổng tiền
const calculateCartTotals = (items: CartItem[]): { totalItems: number; totalAmount: number } => {
  let totalItems = 0;
  let totalAmount = 0;

  items.forEach(item => {
    totalItems += item.quantity;
    totalAmount += item.product.price * item.quantity;
  });

  return { totalItems, totalAmount };
};

export const cartAction = {
  // 1. Lấy thông tin giỏ hàng hiện tại
  getCart(): Cart {
    return currentCart;
  },

  // 2. Thêm sản phẩm vào giỏ hàng
  addToCart(product: Product, quantity: number = 1, selectedSize?: string, selectedColor?: string): Cart {
    const existingIndex = currentCart.items.findIndex(
      item =>
        item.productId === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingIndex > -1) {
      // Nếu sản phẩm với cùng phân loại đã có trong giỏ, tăng số lượng
      currentCart.items[existingIndex].quantity += quantity;
    } else {
      // Nếu chưa có, thêm mới vào giỏ hàng
      const newItem: CartItem = {
        id: `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        productId: product.id,
        product,
        quantity,
        selectedSize,
        selectedColor,
      };
      currentCart.items.push(newItem);
    }

    // Cập nhật lại tổng số lượng và tổng tiền
    const totals = calculateCartTotals(currentCart.items);
    currentCart.totalItems = totals.totalItems;
    currentCart.totalAmount = totals.totalAmount;

    return currentCart;
  },

  // 3. Cập nhật số lượng sản phẩm trong giỏ
  updateQuantity(cartItemId: string, quantity: number): Cart {
    if (quantity <= 0) {
      return this.removeFromCart(cartItemId);
    }

    const item = currentCart.items.find(i => i.id === cartItemId);
    if (item) {
      item.quantity = quantity;
    }

    const totals = calculateCartTotals(currentCart.items);
    currentCart.totalItems = totals.totalItems;
    currentCart.totalAmount = totals.totalAmount;

    return currentCart;
  },

  // 4. Xóa một sản phẩm khỏi giỏ hàng
  removeFromCart(cartItemId: string): Cart {
    currentCart.items = currentCart.items.filter(i => i.id !== cartItemId);

    const totals = calculateCartTotals(currentCart.items);
    currentCart.totalItems = totals.totalItems;
    currentCart.totalAmount = totals.totalAmount;

    return currentCart;
  },

  // 5. Làm sạch giỏ hàng
  clearCart(): Cart {
    currentCart = {
      items: [],
      totalItems: 0,
      totalAmount: 0,
    };
    return currentCart;
  },
};