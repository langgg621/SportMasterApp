import { productAction } from '../actions/productAction';
import { searchAction, SearchFilters } from '../actions/searchAction';
import { Product, CreateProductDTO, UpdateProductDTO } from '../models/product';

export const productController = {
  // Lấy danh sách sản phẩm theo bộ lọc hoặc từ khóa
  getProducts(filters?: SearchFilters): Product[] {
    if (filters && filters.keyword) {
      return searchAction.searchProducts(filters);
    }
    return productAction.getProducts(filters);
  },

  // Xem chi tiết sản phẩm
  getProductDetails(id: string): Product | undefined {
    return productAction.getProductById(id);
  },

  // Thêm mới sản phẩm
  createNewProduct(dto: CreateProductDTO): Product {
    return productAction.createProduct(dto);
  },

  // Cập nhật sản phẩm
  updateExistingProduct(dto: UpdateProductDTO): Product | null {
    return productAction.updateProduct(dto);
  },

  // Xóa sản phẩm
  removeProduct(id: string): boolean {
    return productAction.deleteProduct(id);
  },

  // Lấy gợi ý từ khóa tìm kiếm
  getSearchSuggestions(keyword: string): string[] {
    return searchAction.getSearchSuggestions(keyword);
  },
};