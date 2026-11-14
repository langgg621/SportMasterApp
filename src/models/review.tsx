export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  fullName?: string;
  rating: number;
  comment?: string;
  createDate: string;
  totalCount?: number;
}

export interface ReviewListResult {
  items: ProductReview[];
  ratingDistribution: { rating: number; total: number }[];
  total: number;
}