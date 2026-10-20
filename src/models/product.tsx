import { GenderTargetType } from './genderTarget';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  rating: number;
  reviewsCount: number;
  
  // Phân loại nhóm đối tượng (Nam, Nữ, Trẻ em)
  targetGroup: GenderTargetType; // 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX'
  
  categoryId: string;
  brandId: string;
  
  images: string[];
  stock: number;
  sizes?: string[];
  colors?: string[];          // Ví dụ: ['Бежевый', 'Белый', 'Черный']
  productType?: string;
  // --- BỔ SUNG CÁC TRƯỜNG PHỤC VỤ MÀN HÌNH LỌC (FILTER) ---
  sport?: string;             // Вид спорта
  season?: string;            // Сезон
  collab?: string;            // Коллаборация
  collection?: string;        // Легендарные коллекции
  closure?: string;           // Застежка
  pronation?: string;         // Тип пронации
  training?: string;          // Тип тренировки
  soleColor?: string;         // Цвет подошвы
  fitWidth?: string;          // Полнота
  material?: string;          // Материал верха
  surface?: string;           // Покрытие
  waterproof?: string;        // Защита от влаги
  insulation?: string;        // Утеплитель
  features?: string[];        // Особенности модели
  technologies?: string[];    // Технологии
  
  isHotDeal?: boolean;        // Товары со скидкой / Лучшая цена
  isNew?: boolean;            // Новая коллекция / Новые бренды
  saleCampaignId?: string;    // Liên kết với chương trình Sale nếu có
  
  createdAt: string;
  updatedAt: string;
}

// DTO dùng cho việc Thêm mới sản phẩm (Create)
export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  targetGroup: GenderTargetType;
  categoryId: string;
  brandId: string;
  images: string[];
  stock: number;
  sizes?: string[];
  colors?: string[];
  sport?: string;
  season?: string;
  closure?: string;
  material?: string;
  surface?: string;
  isHotDeal?: boolean;
  isNew?: boolean;
}

// DTO dùng cho việc Chỉnh sửa sản phẩm (Update)
export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  id: string;
}