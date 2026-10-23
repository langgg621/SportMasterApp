import { MOCK_SHIPPING_METHODS } from '../data/mockData';
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
  calculateTotal(shippingMethodId?: string, bonusPoints: number = 0) {
    const cartState = cartController.getCartState();
    const subtotal = cartState?.totalAmount || 0;
    
    // Tìm phí vận chuyển tương ứng nếu có
    const shippingMethod = shippingMethodId 
      ? MOCK_SHIPPING_METHODS.find(m => m.id === shippingMethodId)
      : null;
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

  // Hàm tạo đơn hàng chính gọi từ CheckoutScreen
createOrder(params: {
    pickupPoint?: string;
    deliveryType?: DeliveryMethod | 'pickup' | 'delivery';
    paymentType?: PaymentMethodType | 'online' | 'cash';
    usedBonusPoints?: number;
    shippingMethodId?: string;
  }): Order {
    const cartState = cartController.getCartState();
    const totals = this.calculateTotal(params.shippingMethodId, params.usedBonusPoints || 0);

    // Thêm từ khóa const cho part2
    const part1 = Math.floor(10000000 + Math.random() * 90000000);
    const part2 = Math.floor(100000 + Math.random() * 900000);
    const formattedOrderNumber = `${part1}-${part2}`;

    const deliveryMethodValue: DeliveryMethod = 
      params.deliveryType === 'delivery' ? 'delivery' : 'pickup';

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      number: part1, 
      orderNumber: formattedOrderNumber,
      items: [...(cartState?.items || [])],
      method: deliveryMethodValue,
      pickupAddress: params.pickupPoint || 'Томск, улица Мусы Джалиля, Дом 59',
      total: totals.total > 0 ? totals.total : cartState?.totalAmount || 0,
    };

    userOrdersList.unshift(newOrder);
    return newOrder;
  },

  // Xác nhận đặt hàng và lưu vào danh sách đơn hàng (Bao bọc hàm createOrder)
  placeOrder(params: {
    deliveryMethod: DeliveryMethod;
    shippingMethodId: string;
    pickupAddress: string;
    paymentMethod: PaymentMethodType;
    usedBonusPoints?: number;
  }): Order {
    const order = this.createOrder({
      pickupPoint: params.pickupAddress,
      deliveryType: params.deliveryMethod,
      paymentType: params.paymentMethod,
      usedBonusPoints: params.usedBonusPoints,
      shippingMethodId: params.shippingMethodId,
    });

    

    return order;
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