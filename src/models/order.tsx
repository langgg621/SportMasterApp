export interface OrderItem {
  id: string;
  orderId?: string;
  productId: string;
  colorId?: string | null;
  sizeId?: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  
  // Computed fields (từ GetDetail)
  productName?: string;
  imageUrl?: string;
  sizeName?: string;
  colorName?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  pickupId?: string | null;
  shippingAddress?: string | null;
  shippingPhone?: string | null;
  deliveryType?: string;
  shippingFee: number;
  subtotal: number;
  paymentType?: string;
  totalAmount: number;
  discountAmount: number;
  status: number;                   // 1: Создан, 2: В пути, 3: Выполнен, 4: Отменён
  createDate: string;

  // Computed fields (từ danh sách)
  itemCount?: number;
  firstImageUrl?: string;
  totalCount?: number;

  // Computed fields (từ GetDetail)
  pickupName?: string;
  pickupAddress?: string;
  pickupWorkingHours?: string;
  items?: OrderItem[];
}

export interface OrderConfirmation {
  orderId: string;
  orderNumber: string;
  status: number;
  statusText: string;               // Trạng thái tiếng Nga
  totalAmount: number;
  paymentType: string;
  deliveryType: string;
  createDate: string;
  pickupName?: string;
  pickupAddress?: string;
  availableFrom: string;
  availableFromText: string;        // vd: "15 января"
  payBefore: string;                // Hạn thanh toán
  items: OrderItem[];
}