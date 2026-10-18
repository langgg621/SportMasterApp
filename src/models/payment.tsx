export type PaymentMethodType = 'CASH_ON_DELIVERY' | 'CARD_ONLINE' | 'SBP' | 'BONUS_POINTS';

export interface PaymentInfo {
  method: PaymentMethodType;
  isPaid: boolean;
  transactionId?: string;
}