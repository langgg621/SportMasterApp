export interface User {
  id: string;
  fullName: string;
  userName?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  sex?: number | null;              // 0: Nữ, 1: Nam
  bonusPoints: number;
  membershipRank: number;           // 1: Thường, 2: Vàng, 3: VIP
  createdAt?: string;
  updatedAt?: string | null;
  password: string;
}

export interface BonusPoint {
  bonusId: number;
  userId: string;
  bonusPoint: number;
  bonusExpired?: string;
  isActive: boolean;
}