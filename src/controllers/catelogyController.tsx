import { MOCK_CATEGORIES, MOCK_GENDER_TARGETS, MOCK_PRODUCTS } from '../data/mockData';
import { Category } from '../models/category';
import { GenderCategory } from '../models/genderTarget';
import { Product } from '../models/product';

export const categoryController = {
  getAllCategories(): Category[] {
    return MOCK_CATEGORIES;
  },

  getCategoryById(id: string): Category | undefined {
    return MOCK_CATEGORIES.find(cat => cat.id === id);
  },

  getGenderTargets(): GenderCategory[] {
    return MOCK_GENDER_TARGETS;
  },

  // HÀM MỚI: Tìm kiếm sản phẩm trực tiếp dựa theo tên danh mục
  getProductsByCategoryName(categoryName: string): Product[] {
    const matchedCategory = MOCK_CATEGORIES.find(
      cat => cat.name.toLowerCase() === categoryName.toLowerCase() || 
             cat.slug.toLowerCase() === categoryName.toLowerCase()
    );

    if (!matchedCategory) {
      // Nếu không khớp chính xác danh mục, tìm theo từ khóa tên danh mục trong sản phẩm
      return MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(categoryName.toLowerCase()));
    }

    // Lọc các sản phẩm có categoryId khớp với id của danh mục tìm thấy
    return MOCK_PRODUCTS.filter(p => p.categoryId === matchedCategory.id);
  },
};