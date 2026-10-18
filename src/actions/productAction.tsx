import { PRODUCTS } from '../data/mockData';
import { Product, CreateProductDTO, UpdateProductDTO } from '../models/product';
import { GenderTargetType } from '../models/genderTarget';

export const productAction = {
  // 1. Xem danh sách sản phẩm (Có thể lọc theo nhóm đối tượng, danh mục hoặc từ khóa tìm kiếm)
  getProducts(filters?: {
    targetGroup?: GenderTargetType;
    categoryId?: string;
    brandId?: string;
    searchKeyword?: string;
  }): Product[] {
    let result = [...PRODUCTS];

    if (filters) {
      if (filters.targetGroup) {
        result = result.filter(p => p.targetGroup === filters.targetGroup || p.targetGroup === 'UNISEX');
      }
      if (filters.categoryId) {
        result = result.filter(p => p.categoryId === filters.categoryId);
      }
      if (filters.brandId) {
        result = result.filter(p => p.brandId === filters.brandId);
      }
      if (filters.searchKeyword) {
        const keyword = filters.searchKeyword.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(keyword));
      }
    }

    return result;
  },

  // 2. Xem chi tiết một sản phẩm theo ID
  getProductById(id: string): Product | undefined {
    return PRODUCTS.find(p => p.id === id);
  },

  // 3. Thêm mới sản phẩm (Create)
  createProduct(dto: CreateProductDTO): Product {
    const newProduct: Product = {
      id: `p_${Date.now()}`,
      ...dto,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    PRODUCTS.unshift(newProduct); // Đẩy lên đầu danh sách
    return newProduct;
  },

  // 4. Sửa thông tin sản phẩm (Update)
  updateProduct(dto: UpdateProductDTO): Product | null {
    const index = PRODUCTS.findIndex(p => p.id === dto.id);
    if (index === -1) return null;

    const updatedProduct: Product = {
      ...PRODUCTS[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    PRODUCTS[index] = updatedProduct;
    return updatedProduct;
  },

  // 5. Xóa sản phẩm (Delete)
  deleteProduct(id: string): boolean {
    const index = PRODUCTS.findIndex(p => p.id === id);
    if (index === -1) return false;

    PRODUCTS.splice(index, 1);
    return true;
  },
};