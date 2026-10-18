export interface UserAddress {
  id: string;
  city: string;
  street: string;
  house: string;
  apartment?: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  bonusPoints: number;        // Số điểm thưởng tích lũy (бонусы) trong ứng dụng Sportmaster
  addresses: UserAddress[];
  savedProductIds: string[];  // Danh sách ID sản phẩm yêu thích (thả tim)
}

export interface UpdateUserDTO {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
}