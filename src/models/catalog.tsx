export interface Category {
  id: string;
  name: string;
  icon?: string;
  parentId?: string | null;
  isActive: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface Color {
  id: string;
  colorName: string;
  colorType?: string;
}

export interface Collection {
  id: string;
  collectionName: string;
}

export interface CatalogSection {
  id: string;
  sectionType: 'service' | 'gender' | 'category' | 'sport';
  title: string;
  imageUrl?: string;
  linkUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  displayOrder: number;
  type: number;                     // 1: main, 2: discount, 3: single
}

export interface DailyDeal {
  id: string;
  productId: string;
  startAt: string;
  endAt: string;
  sortOrder: number;
  isActive: boolean;
}