import { Product } from "./product";

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
  name: string;
  phone: string;
  email: string;
  bonusPoints: number;
  bonusExpiry: string;
  location: string;
  clubLevel: string;
  cashback: string;
  avatarUrl?: string;
}

export interface UpdateUserDTO {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}