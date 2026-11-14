export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  workingHours: string;
  storageDays: number;
  isActive: boolean;
  pointType: string;                // 'store' | 'partner' | 'locker'
  pickupFee: number;
  etaDaysMin?: number;
  etaDaysMax?: number;
  isInstant: boolean;
  prepayPercent?: number;
}

export interface DeliveryOption {
  id: string;
  groupKey: 'pickup' | 'delivery';
  optionCode: string;
  title: string;
  feeAmount: number;
  etaDaysMin?: number;
  etaDaysMax?: number;
  etaMinutes?: number;
  prepayPercent: number;
  note?: string;
  sortOrder: number;
  isActive: boolean;
}