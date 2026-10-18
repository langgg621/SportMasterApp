import { CartItem } from './cartItem';

export type DeliveryMethod = 'pickup' | 'delivery';

export interface Order {
  number: string;
  items: CartItem[];
  method: DeliveryMethod;
  pickupAddress: string;
  total: number;
}
