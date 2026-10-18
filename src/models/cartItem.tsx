import { Product } from './product';

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}