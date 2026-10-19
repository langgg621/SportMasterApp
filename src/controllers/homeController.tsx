import { 
  MOCK_BRANDS, 
  MOCK_BANNERS, 
  MOCK_GENDER_TARGETS, 
  MOCK_SERVICE_SECTIONS,
  MOCK_CAROUSEL_BANNERS,
  MOCK_HOME_SERVICES,
  CATEGORIES_BY_GENDER,
  SPORTS_LIST 
} from '../data/mockData';

export const homeController = {
  // Lấy danh sách thương hiệu
  getBrands: () => {
    return MOCK_BRANDS;
  },

  // Lấy danh sách banner khuyến mãi đầu trang
  getPromoBanners: () => {
    return MOCK_BANNERS;
  },

  // Lấy danh sách nhóm đối tượng (Женщинам, Мужчинам, Детям)
  getGenderTargets: () => {
    return MOCK_GENDER_TARGETS;
  },
    getCarouselBanners: () => {
    return MOCK_CAROUSEL_BANNERS;
  },
  getHomeServices: () => {return MOCK_HOME_SERVICES;},
  // Lấy danh mục sản phẩm theo đối tượng trên màn Home
getCategoriesByGender: (genderKey: 'Женщинам' | 'Мужчинам' | 'Детям') => {
    return CATEGORIES_BY_GENDER[genderKey] || CATEGORIES_BY_GENDER['Женщинам'];
  },

  // Lấy dịch vụ phổ biến
  getPopularServices: () => {
    return MOCK_SERVICE_SECTIONS;
  },
  getSports: () => {
    return SPORTS_LIST;
  },
};