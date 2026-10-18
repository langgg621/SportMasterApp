import { orderAction } from '../actions/orderAction';
import { ShippingMethod } from '../models/shipping';
import { PaymentMethodType } from '../models/payment';
import { Order, DeliveryMethod } from '../models/order';

export const orderController = {
  // Lấy các phương thức vận chuyển
  getShippingOptions(): ShippingMethod[] {
    return orderAction.getShippingMethods();
  },

  // Tính toán tổng tiền thanh toán realtime
  calculateTotal(shippingMethodId: string, bonusPoints: number = 0) {
    return orderAction.calculateOrderTotal(shippingMethodId, bonusPoints);
  },

  // Xác nhận đặt hàng
  placeOrder(params: {
    deliveryMethod: DeliveryMethod;
    shippingMethodId: string;
    pickupAddress: string;
    paymentMethod: PaymentMethodType;
    usedBonusPoints?: number;
  }): Order {
    return orderAction.createOrder(params);
  },

  // Lấy lịch sử đơn hàng
  getUserOrders(): Order[] {
    return orderAction.getOrders();
  },

  // Xem chi tiết đơn hàng theo mã
  getOrderDetail(orderNumber: string): Order | undefined {
    return orderAction.getOrderByNumber(orderNumber);
  },
};