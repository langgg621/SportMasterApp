export interface ProductSize {
  sizeID: string;
  size: string;
  stock: number;
  cm?: number | null;               // Chiều dài chân (nếu có)
}

export interface ProductColor {
  colorID: string;
  name: string;
  type?: string;                    // Mã màu (vd: 'white', 'black')
}

export interface Product {
  id: string;
  productName: string;
  sku?: string | null;
  price: number;
  discount?: number | null;
  categoryId?: string;
  brandId?: string;
  gender?: number | null;           // 1: Nam, 2: Nữ, 3: Unisex
  season?: string | null;
  sportType?: string | null;
  upperMaterial?: string | null;
  fastener?: string | null;
  waterProtection?: string | null;
  insulation?: string | null;
  
  isSale?: boolean;
  isBestPrice?: boolean;
  isNewCollection?: boolean;
  isComingSoon?: boolean;
  isExclusive?: boolean;
  isPremium?: boolean;
  isEco?: boolean;

  imageUrl: string;
  description?: string | null;
  createdDate?: string;

  // Computed fields (Backend tự tính toán trả về)
  newPrice?: number;
  brandName?: string;
  categoryName?: string;
  totalStock?: number;
  avgRating?: number;
  reviewCount?: number;
  bonusAmount?: number;

  // Mảng JSON được Backend parse sẵn
  sizes?: ProductSize[];
  colors?: ProductColor[];
  technologies?: string[];
  characteristics?: { key: string; value: string }[];
  collections?: string[];
}

export interface ProductSection {
  sectionKey: string;
  title: string;
  body: string;
}

export interface ProductSpec {
  groupTitle: string;
  label: string;
  value: string;
  sortOrder: number;
}