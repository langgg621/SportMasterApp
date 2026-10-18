import { MOCK_SERVICE_SECTIONS } from '../data/mockData';
import { ServiceSection, ServiceItem } from '../models/service';

export const serviceController = {
  // Lấy toàn bộ danh sách các mục dịch vụ theo từng section
  getServiceSections(): ServiceSection[] {
    return MOCK_SERVICE_SECTIONS;
  },

  // Tìm kiếm dịch vụ theo từ khóa
  searchServices(keyword: string): ServiceItem[] {
    const allItems: ServiceItem[] = MOCK_SERVICE_SECTIONS.flatMap(section => section.items);
    const kw = keyword.toLowerCase();
    return allItems.filter(item => item.title.toLowerCase().replace('\n', ' ').includes(kw));
  },
};