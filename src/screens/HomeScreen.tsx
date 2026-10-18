import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { productController } from '../controllers/productController';
import FloatingNavBar from '../components/FloatingNavBar';
import {cartController} from '../controllers/cartController';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 32;

const Icon = ({ name, size = 20, color = '#b4b7bd' }: { name: string; size?: number; color?: string }) => {
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    search: 'search-outline',
    scan: 'scan-outline',
    chat: 'chatbubble-outline',
    heart: 'heart-outline',
    cart: 'cart-outline',
  };
  
  return <Ionicons name={iconMap[name] || 'ellipse-outline'} size={size} color={color} />;
};

export default function HomeScreen({ navigation }: { navigation?: any }) {
  const [selectedGender, setSelectedGender] = useState<'Женщинам' | 'Мужчинам' | 'Детям'>('Женщинам');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const hitProducts = productController?.getProducts ? productController.getProducts({}).slice(0, 4) : [];

  const promoBanners = [
    {
      id: 'b1',
      title: 'Скидки\nмесяца',
      subTitle: 'Специально для вас!',
      buttonText: 'ПОЛУЧИТЬ',
      backgroundColor: '#ff4d4d',
      type: 'discount',
    },
    {
      id: 'b2',
      title: 'СПОРТ\nМИЛЛИОН\nБОНУСОВ',
      subTitle: 'Кэшбэк 100% бонусами\nна все покупки',
      buttonText: 'ДО 5 ОКТЯБРЯ',
      backgroundColor: '#004bff',
      type: 'bonus',
    },
    {
      id: 'b3',
      title: 'Супер\nсезон',
      subTitle: 'Обновленная коллекция',
      buttonText: 'СМОТРЕТЬ',
      backgroundColor: '#15a945',
      type: 'season',
    },
  ];

  const carouselBanners = [
    {
      id: 'cb1',
      title: 'Мужская куртка',
      subTitle: 'и другие эксклюзивные товары',
      badge: 'ТОЛЬКО У НАС',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
      brandLogo: 'PUMA',
    },
    {
      id: 'cb2',
      title: 'Марафон призов',
      subTitle: 'от Makfa wellness',
      badge: 'ХОРОШЕЕ ЗДОРОВЬЕ',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
      brandLogo: 'MAKFA',
    },
    {
      id: 'cb3',
      title: 'Скидки до -50%',
      subTitle: 'на новую коллекцию',
      badge: 'АКЦИЯ',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
      brandLogo: 'DEMIX',
    },
  ];

  const categoriesData = {
    Женщинам: [
      { id: 'w1', title: 'Одежда', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400' },
      { id: 'w2', title: 'Аксессуары', image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?w=400' },
      { id: 'w3', title: 'Обувь', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
      { id: 'w4', title: 'Стиль', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400' },
    ],
    Мужчинам: [
      { id: 'm1', title: 'Одежда', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400' },
      { id: 'm2', title: 'Аксессуары', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400' },
      { id: 'm3', title: 'Обувь', image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400' },
      { id: 'm4', title: 'Стиль', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400' },
    ],
    Детям: [
      { id: 'k1', title: 'Одежда для девочек', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400' },
      { id: 'k2', title: 'Обувь для девочек', image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400' },
      { id: 'k3', title: 'Одежда для мальчиков', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400' },
      { id: 'k4', title: 'Обувь для мальчиков', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400' },
    ],
  };

  const currentCategories = categoriesData[selectedGender];

  const handleBannerScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / BANNER_WIDTH);
    setActiveBannerIndex(currentIndex);
  };
// Lấy danh sách sản phẩm trong giỏ hàng hiện tại
  const cartState = cartController.getCartState();
  const cartItems = cartState?.items || [];
  
  // Tính tổng số lượng tất cả mặt hàng trong giỏ
  const totalCartCount = cartItems.reduce((sum: number, item: any) => sum + (item?.quantity || 0), 0);
  return (
    <SafeAreaView style={styles.phonePage}>
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        
        {/* --- Top bar & Promos --- */}
        <View style={styles.topbar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topPromos}>
            {promoBanners.map((banner) => (
              <View key={banner.id} style={[styles.promoCard, { backgroundColor: banner.backgroundColor }]}>
                <TouchableOpacity style={styles.promoBtn}>
                  <Text style={{ color: banner.backgroundColor, fontWeight: '800', fontSize: 13 }}>
                    {banner.buttonText}
                  </Text>
                </TouchableOpacity>

                <View style={styles.ticketLine} />

                {banner.type === 'discount' ? (
                  <>
                    <View style={styles.discountShapes}>
                      <Text style={styles.shapeText}>%</Text>
                      <Text style={styles.shapeStrong}>-15%</Text>
                      <Text style={styles.shapeText}>%</Text>
                    </View>
                    <Text style={styles.monthlyTitle}>{banner.title}</Text>
                    <Text style={{ color: 'white', fontSize: 12, marginTop: 10 }}>{banner.subTitle}</Text>
                  </>
                ) : (
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.bonusHeading}>{banner.title}</Text>
                    <Text style={{ color: 'white', fontSize: 12, lineHeight: 18, marginTop: 10 }}>
                      {banner.subTitle}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          {/* Thanh tìm kiếm */}
          <View style={styles.topSearchRow}>
            <TouchableOpacity style={styles.search} onPress={() => navigation?.navigate('SearchScreen')}>
              <Icon name="search" size={18} color="#9ca6c2" />
              <Text style={{ color: '#9ca6c2', flex: 1, marginLeft: 8 }}>Искать в Спортмастере</Text>
              <Icon name="scan" size={18} color="#9ca6c2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatBtn}>
              <Icon name="chat" size={24} color="#b7c0d8" />
              <View style={styles.chatBadge}><Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>1</Text></View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nội dung trang */}
        <View style={styles.pageContent}>
          
          {/* --- 1. MỤC БРЕНДЫ (Sử dụng ảnh logo từ constants/brands) --- */}
          <View style={styles.section}>
            <Text style={styles.hitsTitle}>Бренды</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {[
                { id: 'b1', image: require('../constants/brands/outventure.png') },
                { id: 'b2', image: require('../constants/brands/fila.png') },
                { id: 'b3', image: require('../constants/brands/puma.png') },
                { id: 'b4', image: require('../constants/brands/columbia.png') },
                { id: 'b5', image: require('../constants/brands/kappa.png') },
              ].map((brand) => (
                <TouchableOpacity key={brand.id} style={styles.brandLogoBox} activeOpacity={0.8}>
                  <Image source={brand.image} style={styles.brandLogoImg} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* --- 2. ẢNH HOME_IMAGE.PNG --- */}
          <View style={styles.section}>
            <TouchableOpacity activeOpacity={0.9}>
              <Image 
                source={require('../constants/home_image.png')} 
                style={styles.homeImageBanner} 
                resizeMode="contain" 
              />
            </TouchableOpacity>
          </View>

          {/* --- 3. BANNER CAROUSEL THỨ NHẤT --- */}
          <View style={styles.section}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleBannerScroll}
              scrollEventThrottle={16}
              contentContainerStyle={styles.bannerScrollContainer}
            >
              {carouselBanners.map((banner) => (
                <TouchableOpacity key={banner.id} style={styles.bannerSlide} activeOpacity={0.9}>
                  <Image source={{ uri: banner.image }} style={styles.bannerSlideImg} />
                  <View style={styles.bannerSlideOverlay}>
                    <Text style={styles.bannerBrandLogo}>{banner.brandLogo}</Text>
                    <Text style={styles.bannerSlideTitle}>{banner.title}</Text>
                    <Text style={styles.bannerSlideSub}>{banner.subTitle}</Text>
                    {banner.badge && (
                      <View style={styles.bannerRedBadge}>
                        <Text style={styles.bannerRedBadgeText}>{banner.badge}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.dotsContainer}>
              {carouselBanners.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    activeBannerIndex === index ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* --- 4. PHÂN MỤC NHÓM ĐỐI TƯỢNG --- */}
          <View style={styles.section}>
            <View style={styles.genderTabsContainer}>
              {(['Женщинам', 'Мужчинам', 'Детям'] as const).map((item) => {
                const isSelected = selectedGender === item;
                return (
                  <TouchableOpacity key={item} onPress={() => setSelectedGender(item)}>
                    <Text style={[styles.genderTabText, isSelected && styles.genderTabSelected]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.categoryGrid}>
              {currentCategories.map((cat) => (
                <TouchableOpacity 
                  key={cat.id} 
                  style={styles.categoryCard} 
                  activeOpacity={0.9}
                  onPress={() => navigation?.navigate('CatalogTab')}
                >
                  <Image source={{ uri: cat.image }} style={styles.categoryImg} />
                  <Text style={styles.categoryTitle}>{cat.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* --- 5. ВЫ НЕДАВНО СМОТРЕЛИ --- */}
          <View style={styles.hitsSection}>
            <Text style={styles.hitsTitle}>Вы недавно смотрели</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContainer}>
              {hitProducts.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.productCard}
                  onPress={() => navigation?.navigate('ProductDetail', { productId: item.id })}
                >
                  <View style={styles.productImageWrapper}>
                    <Image source={{ uri: item.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' }} style={styles.productImg} />
                    <View style={styles.floatingActions}>
                      <TouchableOpacity style={styles.actionIconBtn}>
                        <Ionicons name="heart-outline" size={16} color="#666" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionIconBtn}>
                        <Ionicons name="scale-outline" size={16} color="#666" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.productDetailsRow}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.productPrice}>{item.price} ₽</Text>
                        {item.discount && <Text style={styles.productDiscount}>{item.discount}</Text>}
                      </View>
                      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.ratingText}><Text style={{ color: '#086ee7' }}>★</Text> 4.5</Text>
                    </View>

                    <TouchableOpacity style={styles.blueCartBtn}>
                      <Ionicons name="cart-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* --- 6. ВИДЫ СПОРТА --- */}
          <View style={styles.section}>
            <Text style={styles.hitsTitle}>Виды спорта</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              <View style={[styles.sportBox, { backgroundColor: '#dbeaff' }]}><Text style={{ fontWeight: 'bold', fontSize: 15 }}>Тренажеры и фитнес</Text></View>
              <View style={[styles.sportBox, { backgroundColor: '#e5e5e5' }]}><Text style={{ fontWeight: 'bold', fontSize: 15 }}>Футбол</Text></View>
              <View style={[styles.sportBox, { backgroundColor: '#f7e8e8' }]}><Text style={{ fontWeight: 'bold', fontSize: 15 }}>Зимний спорт</Text></View>
            </ScrollView>
          </View>

          {/* --- 7. ТОВАРЫ ДНЯ --- */}
          <View style={styles.dailySectionContainer}>
            <Text style={styles.hitsTitle}>Товары дня</Text>

            <View style={styles.purpleCountdownBanner}>
              <View style={styles.countdownLeft}>
                <Text style={styles.countdownLabel}>До конца акции</Text>
                <View style={styles.timeBoxRow}>
                  <View style={styles.timeBoxContainer}>
                    <Text style={styles.timeNumber}>12</Text>
                    <Text style={styles.timeUnit}>час</Text>
                  </View>
                  <Text style={styles.timeColon}>:</Text>
                  <View style={styles.timeBoxContainer}>
                    <Text style={styles.timeNumber}>41</Text>
                    <Text style={styles.timeUnit}>мин</Text>
                  </View>
                  <Text style={styles.timeColon}>:</Text>
                  <View style={styles.timeBoxContainer}>
                    <Text style={styles.timeNumber}>38</Text>
                    <Text style={styles.timeUnit}>сек</Text>
                  </View>
                </View>
              </View>

              <View style={styles.alarm3dWrapper}>
                <Text style={{ fontSize: 60 }}>⏰</Text>
              </View>
            </View>

            <View style={styles.dailyProductsOverlayWrapper}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContainer}>
                
                <TouchableOpacity style={styles.productCard}>
                  <View style={styles.productImageWrapper}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400' }} style={styles.productImg} />
                    <View style={styles.floatingActions}>
                      <TouchableOpacity style={styles.actionIconBtn}><Ionicons name="heart-outline" size={16} color="#666" /></TouchableOpacity>
                      <TouchableOpacity style={styles.actionIconBtn}><Ionicons name="scale-outline" size={16} color="#666" /></TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.productDetailsRow}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.productPrice}>6 299 ₽</Text>
                        <Text style={styles.productDiscount}>-30%</Text>
                      </View>
                      <Text style={{ textDecorationLine: 'line-through', color: '#aaa', fontSize: 11 }}>8 999 ₽</Text>
                      <Text style={styles.productName} numberOfLines={2}>Пуховик женский Kappa</Text>
                      <View style={styles.purpleBadge}><Text style={styles.purpleBadgeText}>Товар дня</Text></View>
                      <Text style={styles.ratingText}><Text style={{ color: '#086ee7' }}>★</Text> 5.0 (29)</Text>
                    </View>
                    <TouchableOpacity style={styles.blueCartBtn}><Ionicons name="cart-outline" size={18} color="#fff" /></TouchableOpacity>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.productCard}>
                  <View style={styles.productImageWrapper}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400' }} style={styles.productImg} />
                    <View style={styles.floatingActions}>
                      <TouchableOpacity style={styles.actionIconBtn}><Ionicons name="heart-outline" size={16} color="#666" /></TouchableOpacity>
                      <TouchableOpacity style={styles.actionIconBtn}><Ionicons name="scale-outline" size={16} color="#666" /></TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.productDetailsRow}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.productPrice}>1 259 ₽</Text>
                        <Text style={styles.productDiscount}>-30%</Text>
                      </View>
                      <Text style={{ textDecorationLine: 'line-through', color: '#aaa', fontSize: 11 }}>1 799 ₽</Text>
                      <Text style={styles.productName} numberOfLines={2}>Лонгслив женский Outventure</Text>
                      <View style={styles.purpleBadge}><Text style={styles.purpleBadgeText}>Товар дня</Text></View>
                      <Text style={styles.ratingText}><Text style={{ color: '#086ee7' }}>★</Text> 4.9 (176)</Text>
                    </View>
                    <TouchableOpacity style={styles.blueCartBtn}><Ionicons name="cart-outline" size={18} color="#fff" /></TouchableOpacity>
                  </View>
                </TouchableOpacity>

              </ScrollView>
            </View>
          </View>

        </View>
      </ScrollView>

      <FloatingNavBar 
        activeTab="Главная" 
        cartCount={totalCartCount}
        onTabPress={(tab) => {
          if (tab === 'Главная') navigation.navigate('HomeTab');
          if (tab === 'Каталог') navigation.navigate('CatalogTab');
          if (tab === 'Сервисы') navigation.navigate('ServicesTab');
          if (tab === 'Корзина') navigation.navigate('CartTab');
          if (tab === 'Профиль') navigation.navigate('ProfileTab');
        }}
        onStorePress={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  phonePage: { flex: 1, backgroundColor: '#fff', maxWidth: 390, alignSelf: 'center', width: '100%', position: 'relative' },
  topbar: { backgroundColor: '#171d31', borderBottomLeftRadius: 22, borderBottomRightRadius: 22, padding: 16, paddingTop: 24 },
  topPromos: { gap: 10, paddingRight: 16 },
  promoCard: { width: 240, height: 340, borderRadius: 15, padding: 20, overflow: 'hidden', position: 'relative' },
  promoBtn: { width: 142, height: 42, backgroundColor: 'white', borderRadius: 7, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 17 },
  ticketLine: { height: 1, marginHorizontal: -20, borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#171d31' },
  discountShapes: { height: 118, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  shapeText: { padding: 7, borderRadius: 8, backgroundColor: '#ef3442', color: 'white', fontWeight: 'bold', transform: [{ rotate: '-18deg' }] },
  shapeStrong: { padding: 11, borderRadius: 11, backgroundColor: '#e62436', color: 'white', fontSize: 32, fontWeight: 'bold', transform: [{ rotate: '12deg' }] },
  monthlyTitle: { fontSize: 34, fontWeight: 'bold', color: 'white', lineHeight: 34, letterSpacing: -1 },
  bonusHeading: { fontSize: 26, fontStyle: 'italic', fontWeight: 'bold', color: 'white', lineHeight: 28 },
  topSearchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  search: { flex: 1, height: 44, backgroundColor: '#303950', borderRadius: 24, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  chatBtn: { position: 'relative', padding: 6, justifyContent: 'center', alignItems: 'center' },
  chatBadge: { position: 'absolute', right: -1, top: -2, width: 17, height: 17, borderRadius: 8.5, backgroundColor: '#f3203d', justifyContent: 'center', alignItems: 'center' },
  pageContent: { paddingVertical: 8 },
  section: { paddingHorizontal: 16, marginTop: 30 },
  horizontalScroll: { gap: 10, paddingBottom: 10 },

  /* Style cho logo Brand dạng ảnh local */
  brandLogoBox: {
    width: 110,
    height: 55,
    borderRadius: 14,
    backgroundColor: '#f4f5f7',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  brandLogoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  homeImageBanner: {
    width: '100%',
    height: 100,
    borderRadius: 16,
  },

  bannerScrollContainer: {
    gap: 12,
  },
  bannerSlide: {
    width: BANNER_WIDTH,
    height: 190,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#111',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  bannerSlideImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  bannerSlideOverlay: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  bannerBrandLogo: { color: '#fff', fontSize: 16, fontWeight: '900', fontStyle: 'italic', marginBottom: 4 },
  bannerSlideTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  bannerSlideSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
  bannerRedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e53238',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8,
  },
  bannerRedBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 14,
    backgroundColor: '#333',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#d1d1d6',
  },

  sportBox: { width: 161, height: 92, borderRadius: 12, padding: 16, justifyContent: 'flex-end' },

  dailySectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  purpleCountdownBanner: {
    backgroundColor: '#5023b0',
    borderRadius: 20,
    padding: 16,
    height: 180,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'relative',
    overflow: 'hidden',
  },
  countdownLeft: {
    zIndex: 2,
  },
  countdownLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timeBoxContainer: {
    alignItems: 'center',
  },
  timeNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
  },
  timeUnit: {
    fontSize: 10,
    color: '#666',
    marginTop: -2,
  },
  timeColon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginHorizontal: 8,
  },
  alarm3dWrapper: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  dailyProductsOverlayWrapper: {
    marginTop: -90,
    zIndex: 3,
  },

  genderTabsContainer: { flexDirection: 'row', marginTop: 12, gap: 20 },
  genderTabText: { fontSize: 20, fontWeight: 'bold', color: '#8e8e93' },
  genderTabSelected: { color: '#101116' },

  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, justifyContent: 'space-between', gap: 12 },
  categoryCard: { width: '48%', height: 110, borderRadius: 14, overflow: 'hidden', backgroundColor: '#f0f0ef', padding: 12, justifyContent: 'flex-end' },
  categoryImg: { width: '100%', height: '100%', position: 'absolute' },
  categoryTitle: { fontSize: 16, fontWeight: 'bold', color: '#101116', zIndex: 2, backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', borderRadius: 4 },

  hitsSection: {
    marginTop: 34,
    paddingHorizontal: 16,
  },
  hitsTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111',
    marginBottom: 14,
    marginTop: 30
  },
  horizontalScrollContainer: {
    gap: 12,
    paddingBottom: 8,
  },
  productCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  productImageWrapper: {
    width: '100%',
    height: 250,
    backgroundColor: '#f6f6f8',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  productImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  floatingActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    gap: 6,
  },
  actionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  productDiscount: { fontSize: 12, color: '#ff3b30', fontWeight: 'bold' },
  productName: { fontSize: 13, color: '#333', marginTop: 4, height: 36, fontWeight: '500' },
  purpleBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: '#8048e8', marginVertical: 4 },
  purpleBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  ratingText: { fontSize: 12, color: '#666', marginTop: 2 },
  blueCartBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#005bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});