import { CartItem } from './cartItem';

export type DeliveryMethod = 'pickup' | 'delivery';

export interface Order {
  id:string;
  number: number;
  items: CartItem[];
  method: DeliveryMethod;
  pickupAddress: string;
  total: number;
  orderNumber:string;
}
