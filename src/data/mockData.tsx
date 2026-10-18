import { Product } from '../models/product';
import { Category } from '../models/category';
import { Brand } from '../models/brand';
import { GenderCategory } from '../models/genderTarget';
import { AdvertiseBanner } from '../models/advertise';
import { SaleCampaign, FlashSaleItem } from '../models/sale';
import { ShippingMethod } from '../models/shipping';
import { Cart } from '../models/cartItem';
import { Order } from '../models/order';
import { User } from '../models/user';
import { ServiceSection} from '../models/service';
// 1. Danh sách Thương hiệu (Brands)
export const MOCK_BRANDS: Brand[] = [
  { id: 'puma', name: 'PUMA', logoUrl: '../constants/brands/puma.png' },
  { id: 'fila', name: 'FILA', logoUrl: '../constants/brands/fila.png' },
  { id: 'kappa', name: 'Kappa', logoUrl: '../constants/brands/kappa.png' },
  { id: 'outventure', name: 'Outventure', logoUrl: '../constants/brands/outventure.png' },
  { id: 'demix', name: 'Demix', logoUrl: '../constants/brands/demix.png' },
  { id: 'reloa', name: 'Reloa', logoUrl: '' },
];

// 2. Danh sách Nhóm đối tượng (Gender Targets)
export const MOCK_GENDER_TARGETS: GenderCategory[] = [
  { id: 'g1', name: 'Женщинам', slug: 'women', icon: 'woman-outline' },
  { id: 'g2', name: 'Мужчинам', slug: 'men', icon: 'man-outline' },
  { id: 'g3', name: 'Детям', slug: 'kids', icon: 'happy-outline' },
];

// 3. Danh sách Danh mục sản phẩm (Categories)
export const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Обувь', slug: 'footwear', icon: 'footsteps-outline' },
  { id: 'c2', name: 'Одежда', slug: 'clothing', icon: 'shirt-outline' },
  { id: 'c3', name: 'Аксессуары', slug: 'accessories', icon: 'basketball-outline' },
  { id: 'c4', name: 'Тренажеры, фитнес', slug: 'fitness', icon: 'barbell-outline' },
];

// 4. Danh sách Sản phẩm đầy đủ (Products)
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Кроссовки мужские PUMA St Runner V3 L',
    description: 'Классический силуэт кроссовок ST Runner v3, дополненный функциональной отделкой задника.',
    price: 3399,
    oldPrice: 3999,
    discount: '-15%',
    rating: 4.3,
    reviewsCount: 3412,
    targetGroup: 'MEN',
    categoryId: 'c1',
    brandId: 'puma',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    stock: 25,
    sizes: ['38', '39', '39.5', '40', '41', '42'],
    colors: ['Белый', 'Черный'],
    isHotDeal: true,
    isNew: false,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'p2',
    name: 'Кеды утепленные женские FILA Fx-10',
    description: 'Удобные утепленные кеды для стильного повседневного образа.',
    price: 6499,
    oldPrice: 7999,
    discount: '-19%',
    rating: 4.9,
    reviewsCount: 7,
    targetGroup: 'WOMEN',
    categoryId: 'c1',
    brandId: 'fila',
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400'],
    stock: 12,
    sizes: ['36', '37', '38', '39'],
    colors: ['Белый', 'Бежевый'],
    isHotDeal: false,
    isNew: true,
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-09-05T10:00:00Z',
  },
  {
    id: 'p3',
    name: 'Пуховик женский Kappa',
    description: 'Стильный и теплая куртка для зимних прогулок.',
    price: 6299,
    oldPrice: 8999,
    discount: '-30%',
    rating: 5.0,
    reviewsCount: 29,
    targetGroup: 'WOMEN',
    categoryId: 'c2',
    brandId: 'kappa',
    images: ['https://images.unsplash.com/photo-1544441893-675973e31985?w=400'],
    stock: 8,
    sizes: ['42', '44', '46', '48'],
    colors: ['Черный', 'Розовый'],
    isHotDeal: true,
    isNew: false,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-09-10T10:00:00Z',
  },
  {
    id: 'p4',
    name: 'Лонгслив женский Outventure',
    description: 'Удобный лонгслив для активного отдыха и спорта.',
    price: 1259,
    oldPrice: 1799,
    discount: '-30%',
    rating: 4.9,
    reviewsCount: 176,
    targetGroup: 'WOMEN',
    categoryId: 'c2',
    brandId: 'outventure',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'],
    stock: 40,
    sizes: ['40', '42', '44', '46'],
    colors: ['Белый', 'Серый'],
    isHotDeal: true,
    isNew: true,
    createdAt: '2026-04-12T10:00:00Z',
    updatedAt: '2026-09-12T10:00:00Z',
  },
  {
    id: 'fb1',
    name: 'Влажные салфетки для обуви Reloa',
    description: 'Специальные влажные салфетки для эффективной очистки обуви.',
    price: 70,
    oldPrice: 99,
    discount: '-29%',
    rating: 4.9,
    reviewsCount: 4257,
    targetGroup: 'UNISEX',
    categoryId: 'c3',
    brandId: 'reloa',
    images: ['https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400'],
    stock: 150,
    isHotDeal: false,
    isNew: false,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  },
  {
    id: 'fb2',
    name: 'Носки FILA, 2 пары',
    description: 'Комфортные спортивные носки из качественного материала.',
    price: 280,
    oldPrice: 399,
    discount: '-30%',
    rating: 4.9,
    reviewsCount: 6542,
    targetGroup: 'UNISEX',
    categoryId: 'c3',
    brandId: 'fila',
    images: ['https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400'],
    stock: 90,
    sizes: ['38-40', '41-43'],
    colors: ['Белый', 'Черный'],
    isHotDeal: false,
    isNew: false,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  }
];

// 5. Banner quảng cáo trang chủ (Advertise Banners)
export const MOCK_BANNERS: AdvertiseBanner[] = [
  {
    id: 'b1',
    title: 'Скидки месяца',
    subtitle: 'Специально для вас!',
    imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800',
    discountPercent: 15,
    targetScreen: 'CatalogTab',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
  },
  {
    id: 'b2',
    title: 'СПОРТ МИЛЛИОН БОНУСОВ',
    subtitle: 'Кэшбэк 100% бонусами на все покупки',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
    targetScreen: 'HomeTab',
    startDate: '2026-09-20',
    endDate: '2026-10-05',
  },
];

// 6. Chương trình khuyến mãi & Flash Sale
export const MOCK_SALE_CAMPAIGNS: SaleCampaign[] = [
  {
    id: 'sale1',
    title: 'Супер сезон',
    description: 'Обновленная коллекция со скидками до -50%',
    discountPercent: 50,
    bannerUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    startDate: '2026-10-01',
    endDate: '2026-10-25',
    isActive: true,
  },
];

export const MOCK_FLASH_SALE_ITEMS: FlashSaleItem[] = [
  {
    id: 'fs1',
    productId: 'p3',
    salePrice: 6299,
    originalPrice: 8999,
    discountPercent: 30,
    stockLimit: 20,
    soldCount: 14,
    endTime: '2026-10-20T23:59:59Z',
  },
  {
    id: 'fs2',
    productId: 'p4',
    salePrice: 1259,
    originalPrice: 1799,
    discountPercent: 30,
    stockLimit: 50,
    soldCount: 38,
    endTime: '2026-10-20T23:59:59Z',
  },
];

// 7. Phương thức vận chuyển (Shipping Methods)
export const MOCK_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'ship1',
    title: 'Самовывоз из магазина',
    estimatedDays: 'Сегодня',
    price: 0,
  },
  {
    id: 'ship2',
    title: 'Курьерская доставка',
    estimatedDays: '1-2 дня',
    price: 299,
  },
];

// 8. Trạng thái Giỏ hàng ban đầu (Initial Cart)
export const INITIAL_CART: Cart = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

// 9. Lịch sử Đơn hàng mẫu (Initial Orders)
export const MOCK_ORDERS: Order[] = [
  {
    number: 'SM-892341',
    items: [
      {
        id: 'ci_1',
        productId: 'p1',
        product: MOCK_PRODUCTS[0],
        quantity: 1,
        selectedSize: '39.5',
      }
    ],
    method: 'pickup',
    pickupAddress: 'Томск, Буяновский переулок, 3А',
    total: 3399,
  }
];
// Thông tin Profile người dùng
export const MOCK_USER_PROFILE: User = {
  id: 'u1',
  name: 'ЛИНЬ',
  phone: '+7 909 908 90 12',
  email: 'lpham342002@gmail.com',
  bonusPoints: 200,
  bonusExpiry: '20.03.2027',
  location: 'Томск, Буяновский переулок, 3А',
  clubLevel: 'Стандартный',
  cashback: '5% бонусами',
};

// Dữ liệu các dịch vụ và tiện ích
export const MOCK_SERVICE_SECTIONS: ServiceSection[] = [
  {
    title: 'Ваш Спортмастер',
    items: [
      { id: '1', title: 'Бонусная\nкарта', iconName: 'qr-code-outline', bgColor: '#3b82f6' },
      { id: '2', title: 'Акции', iconName: 'pricetag-outline', bgColor: '#ff4d6d' },
      { id: '3', title: 'Магазины', iconName: 'bag-handle-outline', bgColor: '#0066ff' },
      { id: '4', title: 'Сервисные\nуслуги', iconName: 'construct-outline', bgColor: '#6366f1' },
      { id: '5', title: 'Задать\nвопрос', iconName: 'chatbubble-ellipses-outline', bgColor: '#38bdf8' },
    ],
  },
  {
    title: 'Спорт',
    items: [
      { id: 's1', title: 'Трекер\nактивности', iconName: 'flame-outline', bgColor: '#ff7b00' },
      { id: 's2', title: 'Онлайн\nтренировки', iconName: 'barbell-outline', bgColor: '#38bdf8' },
      { id: 's3', title: 'Онлайн\nкурсы', iconName: 'laptop-outline', bgColor: '#818cf8' },
      { id: 's4', title: 'Счетчик\nкалорий', iconName: 'clipboard-outline', bgColor: '#facc15' },
      { id: 's5', title: 'Беговой\nТренер', iconName: 'fitness-outline', bgColor: '#a855f7' },
    ],
  },
  {
    title: 'Досуг',
    items: [
      { id: 'd1', title: 'Live\nтрансляции', iconName: 'megaphone-outline', bgColor: '#ff4d6d' },
      { id: 'd2', title: 'Медиа', iconName: 'image-outline', bgColor: '#6366f1' },
    ],
  },
  {
    title: 'Активный отдых',
    items: [
      { id: 'a1', title: 'Афиша', iconName: 'calendar-outline', bgColor: '#f472b6' },
      { id: 'a2', title: 'Маршруты', iconName: 'location-outline', bgColor: '#0284c7' },
      { id: 'a3', title: 'Беговые\nтренировки', iconName: 'trophy-outline', bgColor: '#7c3aed' },
    ],
  },
];