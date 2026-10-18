export interface ShippingMethod {
  id: string;
  title: string; // Ví dụ: Giao hàng tiêu chuẩn, Nhận tại cửa hàng (Самовывоз), Giao hàng nhanh
  estimatedDays: string;
  price: number;
}