export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  sizeId: string;
  colorId?: string | null;
  quantity: number;
  
  // Computed fields (từ Join bảng)
  productName: string;
  imageUrl: string;
  price: number;
  discount?: number | null;
  newPrice: number;
  lineTotal: number;
  sizeName: string;
  sizeStock: number;
  isOverStock: boolean;
  colorName?: string | null;
  createDate?: string;
  updateDate?: string | null;
}