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
  colors?: string[];
  
  // Trạng thái hiển thị & Khuyến mãi
  isHotDeal?: boolean;      // Thuộc mục Товар дня
  isNew?: boolean;          // Thuộc mục Новая коллекция
  saleCampaignId?: string;  // Liên kết với chương trình Sale nếu có
  
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
  isHotDeal?: boolean;
  isNew?: boolean;
}

// DTO dùng cho việc Chỉnh sửa sản phẩm (Update)
export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  id: string;
}