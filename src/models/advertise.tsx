export interface AdvertiseBanner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  discountPercent?: number;
  targetScreen?: string;
  startDate?: string;
  endDate?: string;
}