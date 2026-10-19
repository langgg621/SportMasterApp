import { MOCK_PRODUCTS, MOCK_FLASH_SALE_ITEMS } from '../data/mockData';
import { Product, CreateProductDTO, UpdateProductDTO } from '../models/product';
import { GenderTargetType } from '../models/genderTarget';

export interface ProductFilters {
  keyword?: string;
  categoryId?: string;
  brandId?: string;
  targetGroup?: GenderTargetType;
  minPrice?: number;
  maxPrice?: number;
  isHotDeal?: boolean;
  isNew?: boolean;
}

export const productController = {
  // Lấy danh sách sản phẩm theo bộ lọc
  getProducts(filters?: ProductFilters): Product[] {
    let results = [...MOCK_PRODUCTS];
    
    if (!filters) return results;

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      results = results.filter(p => p.name.toLowerCase().includes(kw) || p.description?.toLowerCase().includes(kw));
    }
    if (filters.categoryId) {
      results = results.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters.brandId) {
      results = results.filter(p => p.brandId === filters.brandId);
    }
    if (filters.targetGroup) {
      results = results.filter(p => p.targetGroup === filters.targetGroup);
    }
    if (filters.isHotDeal !== undefined) {
      results = results.filter(p => p.isHotDeal === filters.isHotDeal);
    }
    if (filters.isNew !== undefined) {
      results = results.filter(p => p.isNew === filters.isNew);
    }

    return results;
  },

  // Xem chi tiết sản phẩm theo ID
  getProductDetails(id: string): Product | undefined {
    return MOCK_PRODUCTS.find(p => p.id === id);
  },

  // Thêm mới sản phẩm
  createNewProduct(dto: CreateProductDTO): Product {
    const newProduct: Product = {
      id: `p_${Date.now()}`,
      ...dto,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_PRODUCTS.push(newProduct);
    return newProduct;
  },

  // Cập nhật sản phẩm
  updateExistingProduct(dto: UpdateProductDTO): Product | null {
    const index = MOCK_PRODUCTS.findIndex(p => p.id === dto.id);
    if (index === -1) return null;

    MOCK_PRODUCTS[index] = {
      ...MOCK_PRODUCTS[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    return MOCK_PRODUCTS[index];
  },

  // Xóa sản phẩm
  removeProduct(id: string): boolean {
    const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (index === -1) return false;
    MOCK_PRODUCTS.splice(index, 1);
    return true;
  },

  // Gợi ý từ khóa tìm kiếm
  getSearchSuggestions(keyword: string): string[] {
    if (!keyword.trim()) return [];
    const kw = keyword.toLowerCase();
    const matchedNames = MOCK_PRODUCTS
      .map(p => p.name)
      .filter(name => name.toLowerCase().includes(kw));
    return Array.from(new Set(matchedNames)).slice(0, 5);
  },
  // Phương thức sắp xếp danh sách sản phẩm theo tiêu chí
  sortProduct(products: Product[], sortBy: 'popular' | 'price_asc' | 'price_desc' | 'rating'): Product[] {
    let sortedList = [...products];

    switch (sortBy) {
      case 'price_asc':
        sortedList.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sortedList.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
      default:
        sortedList.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        break;
    }

    return sortedList;
  },
};