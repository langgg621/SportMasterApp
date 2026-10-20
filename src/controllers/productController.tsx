import { MOCK_PRODUCTS, MOCK_FLASH_SALE_ITEMS } from '../data/mockData';
import { Product, CreateProductDTO, UpdateProductDTO } from '../models/product';
import { GenderTargetType } from '../models/genderTarget';

export interface ProductFilters {
  keyword?: string;
  categoryId?: string;
  brandId?: string;
  brandIds?: string[];        // Lọc theo nhiều thương hiệu (Бренд)
  colors?: string[];          // Lọc theo màu sắc (Цвет)
  sports?: string[];          // Lọc theo môn thể thao (Вид спорта)
  seasons?: string[];         // Lọc theo mùa (Сезон)
  closures?: string[];        // Lọc theo loại khóa/dây (Застежка)
  materials?: string[];       // Lọc theo chất liệu (Материал верха)
  surfaces?: string[];        // Lọc theo loại bề mặt/địa hình (Покрытие)
  minPrice?: number;
  maxPrice?: number;
  isHotDeal?: boolean;        // Lọc sản phẩm giảm giá / Лучшая цена
  isNew?: boolean;            // Lọc bộ sưu tập mới (Новая коллекция)
  targetGroup?: GenderTargetType;
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
    // Lọc theo danh sách thương hiệu
    if (filters.brandIds && filters.brandIds.length > 0) {
      results = results.filter(p => filters.brandIds?.includes(p.brandId));
    }
    // Lọc theo màu sắc
    if (filters.colors && filters.colors.length > 0) {
      results = results.filter(p => p.colors?.some(c => filters.colors?.includes(c)));
    }
    // Lọc theo môn thể thao
    if (filters.sports && filters.sports.length > 0) {
      results = results.filter(p => p.sport && filters.sports?.includes(p.sport));
    }
    // Lọc theo mùa
    if (filters.seasons && filters.seasons.length > 0) {
      results = results.filter(p => p.season && filters.seasons?.includes(p.season));
    }
    // Lọc theo loại khóa/dây
    if (filters.closures && filters.closures.length > 0) {
      results = results.filter(p => p.closure && filters.closures?.includes(p.closure));
    }
    // Lọc theo chất liệu
    if (filters.materials && filters.materials.length > 0) {
      results = results.filter(p => p.material && filters.materials?.includes(p.material));
    }
    // Lọc theo mặt sân / địa hình
    if (filters.surfaces && filters.surfaces.length > 0) {
      results = results.filter(p => p.surface && filters.surfaces?.includes(p.surface));
    }
    // Lọc theo khoảng giá
    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice!);
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
  getFilterOptions(subset: Product[]) {
    const getOptions = (key: keyof Product) => {
      const values = subset.map(p => p[key]);
      const flattened = values.flatMap(item => Array.isArray(item) ? item : [item]);
      return Array.from(new Set(flattened.filter(Boolean))) as string[];
    };

    return {
      productTypes: getOptions('productType'),
      sizes: getOptions('sizes'),
      brands: getOptions('brandId'),
      sports: getOptions('sport'),
      colors: getOptions('colors'),
      seasons: getOptions('season'),
    };
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
  }
};
