import { MOCK_SHIPPING_METHODS,  } from '../data/mockData';
import { ShippingMethod } from '../models/shipping';
import { PaymentMethodType } from '../models/payment';
import { Order, DeliveryMethod } from '../models/order';
import { cartController } from './cartController';

// Biến lưu trữ lịch sử đơn hàng mô phỏng trong bộ nhớ
let userOrdersList: Order[] = [];

export const orderController = {
  // Lấy các phương thức vận chuyển từ mockData
  getShippingOptions(): ShippingMethod[] {
    return MOCK_SHIPPING_METHODS;
  },

  // Tính toán tổng tiền thanh toán realtime (tiền hàng + phí ship - điểm thưởng)
  calculateTotal(shippingMethodId: string, bonusPoints: number = 0) {
    const cartState = cartController.getCartState();
    const subtotal = cartState.totalAmount;
    
    // Tìm phí vận chuyển tương ứng
    const shippingMethod = MOCK_SHIPPING_METHODS.find(m => m.id === shippingMethodId);
    const shippingFee = shippingMethod ? shippingMethod.price : 0;

    // Mỗi 1 điểm thưởng giảm 1 ₽
    const discount = Math.min(bonusPoints, subtotal + shippingFee);
    
    const total = Math.max(0, subtotal + shippingFee - discount);
    return {
      subtotal,
      shippingFee,
      discount,
      total,
    };
  },

  // Xác nhận đặt hàng và lưu vào danh sách đơn hàng
  placeOrder(params: {
    deliveryMethod: DeliveryMethod;
    shippingMethodId: string;
    pickupAddress: string;
    paymentMethod: PaymentMethodType;
    usedBonusPoints?: number;
  }): Order {
    const cartState = cartController.getCartState();
    const totals = this.calculateTotal(params.shippingMethodId, params.usedBonusPoints || 0);

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      number: Math.floor(100000 + Math.random() * 900000), // Khớp kiểu number trong model order.tsx
      orderNumber: `SM-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cartState.items],
      method: params.deliveryMethod, // Khớp với trường 'method' trong model order.tsx
      pickupAddress: params.pickupAddress,
      total: totals.total, // Khớp với trường 'total' trong model order.tsx
    };

    // Thêm vào danh sách đơn hàng của user
    userOrdersList.unshift(newOrder);

    // Đặt lại giỏ hàng sau khi đặt hàng thành công
    cartController.clearCurrentCart();

    return newOrder;
  },

  // Lấy lịch sử đơn hàng của người dùng
  getUserOrders(): Order[] {
    return userOrdersList;
  },

  // Xem chi tiết đơn hàng theo mã đơn hàng
  getOrderDetail(orderIdentifier: string | number): Order | undefined {
    return userOrdersList.find(
      o => o.id === orderIdentifier || 
           o.number === Number(orderIdentifier) || 
           o.orderNumber === String(orderIdentifier)
    );
  },
};