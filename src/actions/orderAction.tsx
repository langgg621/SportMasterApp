import { cartAction } from './cartAction';
import { SHIPPING_METHODS } from '../data/mockData';
import { ShippingMethod } from '../models/shipping';
import { PaymentMethodType, PaymentInfo } from '../models/payment';
import { Order, DeliveryMethod } from '../models/order';

// Lưu trữ danh sách đơn hàng đã đặt trong bộ nhớ tạm
let ordersList: Order[] = [];

export const orderAction = {
  // 1. Lấy danh sách các phương thức vận chuyển khả dụng
  getShippingMethods(): ShippingMethod[] {
    return SHIPPING_METHODS;
  },

  // 2. Tính toán tổng tiền thanh toán cuối cùng (Tiền hàng + Phí vận chuyển - Điểm thưởng nếu có)
  calculateOrderTotal(shippingMethodId: string, discountPoints: number = 0): {
    subTotal: number;
    shippingFee: number;
    discountAmount: number;
    finalTotal: number;
  } {
    const cart = cartAction.getCart();
    const subTotal = cart.totalAmount;

    // Tìm phí vận chuyển theo ID
    const shippingMethod = SHIPPING_METHODS.find(m => m.id === shippingMethodId);
    const shippingFee = shippingMethod ? shippingMethod.price : 0;

    // Quy đổi điểm thưởng (Ví dụ: 1 điểm = 1 ₽, tối đa giảm không quá tổng tiền hàng)
    const discountAmount = Math.min(discountPoints, subTotal);

    const finalTotal = Math.max(0, subTotal + shippingFee - discountAmount);

    return {
      subTotal,
      shippingFee,
      discountAmount,
      finalTotal,
    };
  },

  // 3. Tiến hành tạo đơn hàng và thanh toán
  createOrder(params: {
    deliveryMethod: DeliveryMethod;
    shippingMethodId: string;
    pickupAddress: string;
    paymentMethod: PaymentMethodType;
    usedBonusPoints?: number;
  }): Order {
    const cart = cartAction.getCart();
    if (cart.items.length === 0) {
      throw new Error('Giỏ hàng đang trống, không thể tạo đơn hàng.');
    }

    const { subTotal, shippingFee, discountAmount, finalTotal } = this.calculateOrderTotal(
      params.shippingMethodId,
      params.usedBonusPoints || 0
    );

    // Xử lý thông tin thanh toán giả lập
    const paymentInfo: PaymentInfo = {
      method: params.paymentMethod,
      isPaid: params.paymentMethod === 'CARD_ONLINE' || params.paymentMethod === 'SBP', // Thanh toán online coi như đã trả tiền trước
      transactionId: `tx_${Date.now()}`,
    };

    // Tạo mã đơn hàng ngẫu nhiên (Ví dụ: SM-83921)
    const orderNumber = `SM-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      number: orderNumber,
      items: [...cart.items],
      method: params.deliveryMethod,
      pickupAddress: params.pickupAddress,
      total: finalTotal,
    };

    // Lưu đơn hàng vào danh sách
    ordersList.unshift(newOrder);

    // Đặt hàng thành công thì làm trống giỏ hàng
    cartAction.clearCart();

    return newOrder;
  },

  // 4. Lấy danh sách lịch sử đơn hàng
  getOrders(): Order[] {
    return ordersList;
  },

  // 5. Xem chi tiết đơn hàng theo số mã đơn
  getOrderByNumber(orderNumber: string): Order | undefined {
    return ordersList.find(o => o.number === orderNumber);
  },
};