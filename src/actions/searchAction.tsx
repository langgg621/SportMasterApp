import { PRODUCTS } from '../data/mockData';
import { Product } from '../models/product';
import { GenderTargetType } from '../models/genderTarget';

export interface SearchFilters {
  keyword?: string;
  targetGroup?: GenderTargetType;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

export const searchAction = {
  // 1. Tìm kiếm và lọc sản phẩm theo nhiều tiêu chí
  searchProducts(filters: SearchFilters): Product[] {
    let results = [...PRODUCTS];

    // Lọc theo từ khóa (tên hoặc mô tả sản phẩm)
    if (filters.keyword && filters.keyword.trim() !== '') {
      const query = filters.keyword.toLowerCase().trim();
      results = results.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query))
      );
    }

    // Lọc theo nhóm đối tượng (Nam, Nữ, Trẻ em, Unisex)
    if (filters.targetGroup) {
      results = results.filter(
        product => product.targetGroup === filters.targetGroup || product.targetGroup === 'UNISEX'
      );
    }

    // Lọc theo danh mục
    if (filters.categoryId) {
      results = results.filter(product => product.categoryId === filters.categoryId);
    }

    // Lọc theo thương hiệu
    if (filters.brandId) {
      results = results.filter(product => product.brandId === filters.brandId);
    }

    // Lọc theo khoảng giá
    if (filters.minPrice !== undefined) {
      results = results.filter(product => product.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(product => product.price <= filters.maxPrice!);
    }

    // Sắp xếp kết quả
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          results.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
      }
    }

    return results;
  },

  // 2. Gợi ý từ khóa tìm kiếm khi người dùng đang nhập (Autocomplete)
  getSearchSuggestions(keyword: string, limit: number = 5): string[] {
    if (!keyword || keyword.trim() === '') return [];

    const query = keyword.toLowerCase().trim();
    const suggestions = new Set<string>();

    PRODUCTS.forEach(product => {
      if (product.name.toLowerCase().includes(query)) {
        suggestions.add(product.name);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  },
};