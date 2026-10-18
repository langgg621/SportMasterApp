import { MOCK_BANNERS, MOCK_SALE_CAMPAIGNS, MOCK_FLASH_SALE_ITEMS } from '../data/mockData';
import { AdvertiseBanner } from '../models/advertise';
import { SaleCampaign, FlashSaleItem } from '../models/sale';

export const advertiseController = {
  getBanners(): AdvertiseBanner[] {
    return MOCK_BANNERS;
  },

  getActiveSales(): SaleCampaign[] {
    return MOCK_SALE_CAMPAIGNS.filter(s => s.isActive);
  },

  getFlashSaleItems(): FlashSaleItem[] {
    return MOCK_FLASH_SALE_ITEMS;
  },
};