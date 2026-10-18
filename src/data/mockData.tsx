import { Brand } from '../models/brand';
import { Category } from '../models/category';
import { GenderCategory } from '../models/genderTarget';
import { Product } from '../models/product';
import { SaleCampaign } from '../models/sale';
import { AdvertiseBanner } from '../models/advertise';
import { ShippingMethod } from '../models/shipping';

// 1. Nhóm đối tượng (Gender Targets: Nam, Nữ, Trẻ em)
export const GENDER_CATEGORIES: GenderCategory[] = [
  { id: 'g1', name: 'Мужчинам', slug: 'men' },
  { id: 'g2', name: 'Женщинам', slug: 'women' },
  { id: 'g3', name: 'Детям', slug: 'kids' },
];

// 2. Thương hiệu (Brands)
export const BRANDS: Brand[] = [
  { id: 'b1', name: 'OUTVENTURE' },
  { id: 'b2', name: 'FILA' },
  { id: 'b3', name: 'PUMA' },
  { id: 'b4', name: 'Kappa' },
  { id: 'b5', name: 'Etonic' },
  { id: 'b6', name: 'The North Face' },
];

// 3. Danh mục sản phẩm (Categories)
export const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Одежда', slug: 'clothing' },
  { id: 'c2', name: 'Обувь', slug: 'footwear' },
  { id: 'c3', name: 'Аксессуары', slug: 'accessories' },
  { id: 'c4', name: 'Тренажеры и фитнес', slug: 'fitness' },
];

// 4. Banner quảng cáo / Khuyến mãi trang chủ (Advertise Banners)
export const ADVERTISE_BANNERS: AdvertiseBanner[] = [
  {
    id: 'adv1',
    title: 'Скидка месяца',
    subtitle: 'Только для вас!',
    discountPercent: 15,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
  },
  {
    id: 'adv2',
    title: 'СПЕЦИ ТРАТИТЬ БОНУСЫ',
    subtitle: '100% кешбэк каждому',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600',
    startDate: '2026-10-01',
    endDate: '2026-10-05',
  },
];

// 5. Chương trình Sale (Sale Campaigns)
export const SALE_CAMPAIGNS: SaleCampaign[] = [
  {
    id: 'sale1',
    title: 'Товары дня',
    description: 'Giảm giá đặc biệt trong ngày với số lượng có hạn',
    discountPercent: 30,
    bannerUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=600',
    startDate: '2026-10-15',
    endDate: '2026-10-16',
    isActive: true,
  },
];

// 6. Danh sách sản phẩm đầy đủ (Products) hỗ trợ Xem, Thêm, Sửa, Xóa
export let PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Куртка утепленная мембранная женская Outventure',
    description: 'Mембранная куртка с технологией ADD DRY, защищает от холода и ветра.',
    price: 6999,
    oldPrice: 9999,
    discount: '-30%',
    rating: 4.9,
    reviewsCount: 316,
    targetGroup: 'WOMEN',
    categoryId: 'c1',
    brandId: 'b1',
    images: ['https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=400'],
    stock: 25,
    sizes: ['42', '44', '46', '48'],
    colors: ['Розовый', 'Черный'],
    isHotDeal: true,
    isNew: false,
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 'p2',
    name: 'Пуховик детский Outventure',
    description: 'Пуховик для активного отдыха и прогулок в холодную погоду.',
    price: 5199,
    oldPrice: 6499,
    discount: '-20%',
    rating: 5.0,
    reviewsCount: 3,
    targetGroup: 'KIDS',
    categoryId: 'c1',
    brandId: 'b1',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400'],
    stock: 12,
    sizes: ['128', '134', '140'],
    colors: ['Синий', 'Черный'],
    isHotDeal: true,
    isNew: false,
    createdAt: '2026-10-02T00:00:00.000Z',
    updatedAt: '2026-10-02T00:00:00.000Z',
  },
  {
    id: 'p3',
    name: 'Ботинки утепленные мужские Etonic Amber',
    description: 'Классические утепленные ботинки из натуральных материалов.',
    price: 35799,
    oldPrice: 35999,
    discount: '-1%',
    rating: 5.0,
    reviewsCount: 5,
    targetGroup: 'MEN',
    categoryId: 'c2',
    brandId: 'b5',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'],
    stock: 8,
    sizes: ['41', '42', '43', '44'],
    colors: ['Коричневый'],
    isHotDeal: false,
    isNew: true,
    createdAt: '2026-10-03T00:00:00.000Z',
    updatedAt: '2026-10-03T00:00:00.000Z',
  },
  {
    id: 'p4',
    name: 'Кроссовки женские The North Face',
    description: 'Giày thể thao nữ thời trang, siêu nhẹ và êm chân.',
    price: 14799,
    oldPrice: 14999,
    discount: '-1%',
    rating: 3.0,
    reviewsCount: 1,
    targetGroup: 'WOMEN',
    categoryId: 'c2',
    brandId: 'b6',
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=400'],
    stock: 15,
    sizes: ['37', '38', '39'],
    colors: ['Be', 'Xám'],
    isHotDeal: false,
    isNew: true,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
];

// 7. Hình thức vận chuyển (Shipping Methods)
export const SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'ship1', title: 'Самовывоз из магазина', estimatedDays: 'Сегодня', price: 0 },
  { id: 'ship2', title: 'Доставка в пункт выдачи (ПВЗ)', estimatedDays: '2-3 дня', price: 199 },
  { id: 'ship3', title: 'Курьерская доставка на дом', estimatedDays: '1-2 дня', price: 399 },
];