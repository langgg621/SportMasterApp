import React, { useState, useEffect, useRef } from 'react';
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
import { cartController } from '../controllers/cartController';
import { homeController } from '../controllers/homeController';
import FloatingNavBar from '../components/FloatingNavBar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 32;
// State lưu từng giá trị giờ, phút, giây

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [selectedGender, setSelectedGender] = useState<'Женщинам' | 'Мужчинам' | 'Детям'>('Женщинам');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Tham chiếu đến ScrollView của Banner Carousel
  const carouselRef = useRef<ScrollView>(null);

  // Lấy dữ liệu từ Controllers
  const hitProducts = productController.getProducts({});
  const cartState = cartController.getCartState();
  const totalCartCount = cartState?.totalItems || 0;

  const brandsList = homeController.getBrands();
  const promoBanners = homeController.getPromoBanners();
  const carouselBanners = homeController.getCarouselBanners();
  const popularServices = homeController.getHomeServices();
  const currentCategories = homeController.getCategoriesByGender(selectedGender);
  const sportsList = homeController.getSports();
  // Tự động chuyển banner sau mỗi 2 giây theo hướng vòng tròn từ trái qua phải
  useEffect(() => {
    const timer = setInterval(() => {
      if (carouselBanners && carouselBanners.length > 0) {
        setActiveBannerIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % carouselBanners.length;
          carouselRef.current?.scrollTo({
            x: nextIndex * BANNER_WIDTH,
            animated: true,
          });
          return nextIndex;
        });
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [carouselBanners]);
  const [timeLeft, setTimeLeft] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
  });
  // Effect đếm ngược tính thời gian đến hết ngày
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diff = Math.max(0, Math.floor((endOfDay.getTime() - now.getTime()) / 1000));

      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      const format = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      setTimeLeft({
        hours: format(h),
        minutes: format(m),
        seconds: format(s),
      });
    };

    updateCountdown();
    const countdownTimer = setInterval(updateCountdown, 1000);

    return () => clearInterval(countdownTimer);
  }, []);
  // Hàm render chung cho thẻ sản phẩm
  const renderProductCard = (item: any, badgeText?: string, badgeColor?: string) => (
    <TouchableOpacity
      key={item.id}
      style={styles.productCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <View style={styles.productImageWrapper}>
        <Image source={{ uri: item.images?.[0] }} style={styles.productImg} />
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
          
          {badgeText && (
            <View style={[styles.customBadge, { backgroundColor: badgeColor || '#8048e8' }]}>
              <Text style={styles.customBadgeText}>{badgeText}</Text>
            </View>
          )}

          <Text style={styles.ratingText}>
            <Text style={{ color: '#005bff' }}>★</Text> {item.rating || '4.9'} ({item.reviewsCount || 120})
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.blueCartBtn}
          onPress={() => cartController.addProductToCart(item, 1, item.sizes?.[0] || 'Standard')}
        >
          <Ionicons name="cart-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.phonePage}>
      
      {/* 
        Sử dụng stickyHeaderIndices={[1]} để phần tử thứ 2 trong ScrollView (Thanh tìm kiếm) 
        tự động dính lên đỉnh màn hình khi cuộn tới đây.
      */}
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 110 }} 
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        
        {/* --- PHẦN 0: NỘI DUNG ĐẦU TRANG (Cuộn đi mất) --- */}
        <View style={styles.scrollableTopSection}>
          <TouchableOpacity style={styles.bonusAlertContainer} activeOpacity={0.9}>
            <Ionicons name="flame" size={16} color="#ffaa00" />
            <Text style={styles.bonusAlertText}>200 бонусов сгорят 20 марта</Text>
          </TouchableOpacity>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topPromos}>
            {promoBanners.map((banner, index) => (
              <View key={banner.id || index} style={[styles.promoCard, { backgroundColor: index % 2 === 0 ? '#ff4d4d' : '#004bff' }]}>
                <TouchableOpacity style={styles.promoBtn}>
                  <Text style={{ color: index % 2 === 0 ? '#ff4d4d' : '#004bff', fontWeight: '800', fontSize: 13 }}>
                    ПОЛУЧИТЬ
                  </Text>
                </TouchableOpacity>
                <Text style={styles.monthlyTitle}>{banner.title}</Text>
                <Text style={{ color: 'white', fontSize: 12, marginTop: 10 }}>{banner.subtitle}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* --- PHẦN 1: THANH TÌM KIẾM (Sẽ tự động DÍNH CỐ ĐỊNH khi cuộn tới) --- */}
        <View style={styles.stickySearchWrapper}>
          <View style={styles.topSearchRow}>
            <TouchableOpacity style={styles.search} onPress={() => navigation.navigate('SearchScreen')}>
              <Ionicons name="search-outline" size={18} color="#9ca6c2" />
              <Text style={{ color: '#9ca6c2', flex: 1, marginLeft: 8 }}>Искать в Спортмастере</Text>
              <Ionicons name="scan-outline" size={18} color="#9ca6c2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate('SearchScreen')}>
              <Ionicons name="chatbubble-outline" size={24} color="#b7c0d8" />
              <View style={styles.chatBadge}><Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>6</Text></View>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- PHẦN 2 TRỞ XUỐNG: NỘI DUNG BÊN DƯỚI --- */}
        <View style={styles.pageContent}>
          
          {/* --- Бренды --- */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Бренды</Text>
              <TouchableOpacity><Text style={styles.allLinkText}>Все</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {brandsList.map((brand) => (
                <TouchableOpacity key={brand.id} style={styles.brandLogoBox} activeOpacity={0.8}>
                  <Text style={{ fontWeight: 'bold', color: '#111' }}>{brand.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* --- ẢNH HOME_IMAGE.PNG --- */}
          <View style={styles.section}>
            <TouchableOpacity activeOpacity={0.9}>
              <Image source={require('../constants/home_image.png')} style={styles.homeImageBanner} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          {/* --- BANNER CAROUSEL & DOTS (Tự động trượt mỗi 2 giây, 2 chấm tròn đổi màu) --- */}
          <View style={styles.section}>
            <ScrollView
              ref={carouselRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
                setActiveBannerIndex(index);
              }}
              scrollEventThrottle={16}
              contentContainerStyle={{ gap: 12 }}
            >
              {carouselBanners.map((banner) => (
                <TouchableOpacity key={banner.id} style={styles.bannerSlide} activeOpacity={0.9}>
                  <Image source={{ uri: banner.image }} style={styles.bannerSlideImg} />
                  <View style={styles.bannerSlideOverlay}>
                    <Text style={styles.bannerBrandLogo}>{banner.brandLogo}</Text>
                    <Text style={styles.bannerSlideTitle}>{banner.title}</Text>
                    <Text style={styles.bannerSlideSub}>{banner.subTitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Hai chấm tròn hình tròn (Pagination Dots) thay đổi màu sắc */}
            <View style={styles.paginationDotsRow}>
              {carouselBanners.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    activeBannerIndex === index ? styles.dotActive : styles.dotInactive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* --- BANNER ĐƠN --- */}
          <View style={styles.section}>
            <TouchableOpacity activeOpacity={0.9}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800' }} 
                style={styles.singleBannerImg} 
                resizeMode="cover" 
              />
            </TouchableOpacity>
          </View>

          {/* --- PHÂN MỤC ĐỐI TƯỢNG & DANH MỤC --- */}
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
                  onPress={() => navigation.navigate('CatalogTab')}
                >
                  <Image source={{ uri: cat.image }} style={styles.categoryImg} />
                  <Text style={styles.categoryTitle}>{cat.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* --- ВЫ НЕДАВНО СМОТРЕЛИ --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Вы недавно смотрели</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContainer}>
              {hitProducts.map((item) => renderProductCard(item))}
            </ScrollView>
          </View>
          {/* --- ВИДЫ СПОРТА (Thêm mới ở đây) --- */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Виды спорта</Text>
              <TouchableOpacity><Text style={styles.allLinkText}>Все</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {sportsList.map((sport) => (
                <TouchableOpacity key={sport.id} style={styles.sportCard} activeOpacity={0.8}>
                  <Image source={{ uri: sport.image }} style={styles.sportCardImg} resizeMode="cover" />
                  <View style={styles.sportOverlay} />
                  <Text style={styles.sportTitle}>{sport.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* --- banner --- */}
          <View style={styles.section}>
            <ScrollView
              ref={carouselRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
                setActiveBannerIndex(index);
              }}
              scrollEventThrottle={16}
              contentContainerStyle={{ gap: 12 }}
            >
              {carouselBanners.map((banner) => (
                <TouchableOpacity key={banner.id} style={styles.bannerSlide} activeOpacity={0.9}>
                  <Image source={{ uri: banner.image }} style={styles.bannerSlideImg} />
                  <View style={styles.bannerSlideOverlay}>
                    <Text style={styles.bannerBrandLogo}>{banner.brandLogo}</Text>
                    <Text style={styles.bannerSlideTitle}>{banner.title}</Text>
                    <Text style={styles.bannerSlideSub}>{banner.subTitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Hai chấm tròn hình tròn (Pagination Dots) thay đổi màu sắc */}
            <View style={styles.paginationDotsRow}>
              {carouselBanners.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    activeBannerIndex === index ? styles.dotActive : styles.dotInactive,
                  ]}
                />
              ))}
            </View>
          </View>
        

          {/* --- ТОВАРЫ ДНЯ --- */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Товары дня</Text>
              <TouchableOpacity><Text style={styles.allLinkText}>Все</Text></TouchableOpacity>
            </View></View>
          <View style={styles.dailySectionContainer}>
            <View style={styles.purpleCountdownBanner}>
              <View>
                <Text style={styles.countdownLabel}>До конца акции</Text>
                <View style={styles.timeBoxRow}>
                  {/* Hàng hiển thị con số */}
                  <View style={styles.timeNumbersRow}>
                    <Text style={styles.timeNumber}>{timeLeft.hours}</Text>
                    <Text style={styles.timeColonText}>:</Text>
                    <Text style={styles.timeNumber}>{timeLeft.minutes}</Text>
                    <Text style={styles.timeColonText}>:</Text>
                    <Text style={styles.timeNumber}>{timeLeft.seconds}</Text>
                  </View>

                  {/* Hàng hiển thị nhãn đơn vị dưới mỗi con số */}
                  <View style={styles.timeLabelsRow}>
                    <Text style={styles.timeLabelText}>час</Text>
                    <Text style={styles.timeLabelText}>мин</Text>
                    <Text style={styles.timeLabelText}>сек</Text>
                  </View>
                  
                </View>
              </View>
              <Text style={{ fontSize: 180,marginRight: -20, alignSelf: 'center' }}>⏰</Text>
            </View>

            <View style={styles.dailyProductsOverlayWrapper}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContainer}>
                {hitProducts.map((item) => renderProductCard(item, 'Товар дня', '#8048e8'))}
              </ScrollView>
            </View>
          </View>
          {/* --- ПОПУЛЯРНЫЕ СЕРВИСЫ --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Популярные сервисы</Text>
            <View style={styles.servicesGrid}>
              {popularServices.map((service) => (
                <TouchableOpacity key={service.id} style={styles.serviceItemBox}>
                  <View style={[styles.serviceIconCircle, { backgroundColor: service.color || '#dbeaff' }]}>
                    <Ionicons name={(service.icon || 'barbell-outline') as any} size={24} color="#111" />
                  </View>
                  <Text style={styles.serviceItemText} numberOfLines={2}>{service.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* --- THANH ĐIỀU HƯỚNG NỔI DƯỚI ĐÁY --- */}
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
  
  scrollableTopSection: {
    backgroundColor: '#171d31',
    paddingTop: 12,
    paddingBottom: 16,
  },

  stickySearchWrapper: {
    backgroundColor: '#171d31',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    zIndex: 99,
  },

  bonusAlertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#363c4f',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 8,
  },
  bonusAlertText: { color: '#fff', fontSize: 13, fontWeight: '500' },

  topPromos: { gap: 10, paddingHorizontal: 16 },
  promoCard: { width: 240, height: 330, borderRadius: 15, padding: 16, overflow: 'hidden' }, 
  promoBtn: { width: 130, height: 38, backgroundColor: 'white', borderRadius: 7, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 12 },
  monthlyTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', lineHeight: 28 },
  
  topSearchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  search: { flex: 1, height: 44, backgroundColor: '#303950', borderRadius: 10, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  chatBtn: { position: 'relative', padding: 6, justifyContent: 'center', alignItems: 'center' },
  chatBadge: { position: 'absolute', right: -1, top: -2, width: 17, height: 17, borderRadius: 8.5, backgroundColor: '#f3203d', justifyContent: 'center', alignItems: 'center' },
  
  pageContent: { paddingVertical: 8, backgroundColor: '#fff' },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 24, fontWeight: '600', color: '#111', marginBottom: 20, marginTop:30 },
  allLinkText: { fontSize: 18, color: '#005bff', fontWeight: '600' },
  horizontalScroll: { gap: 10, paddingBottom: 6 },

  brandLogoBox: { width: 100, height: 50, borderRadius: 12, backgroundColor: '#f4f5f7', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },

  homeImageBanner: { width: '100%', height: 100, borderRadius: 16 },
  singleBannerImg: { width: BANNER_WIDTH, height: 200, borderRadius: 20, marginVertical:20 },
  bannerSlide: { width: BANNER_WIDTH, height: 200, borderRadius: 20, overflow: 'hidden', backgroundColor: '#111', justifyContent: 'flex-end', marginVertical:20 },
  bannerSlideImg: { width: BANNER_WIDTH, height: 200, position: 'absolute',},
  bannerSlideOverlay: { padding: 16, backgroundColor: 'rgba(0,0,0,0.25)' },
  bannerBrandLogo: { color: '#fff', fontSize: 14, fontWeight: '900', fontStyle: 'italic', marginBottom: 2 },
  bannerSlideTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  bannerSlideSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },

  // Cả hai chấm đều là hình tròn, chỉ đổi màu sắc
  paginationDotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: '#333',
  },
  dotInactive: {
    backgroundColor: '#d1d1d6',
  },

  genderTabsContainer: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  genderTabText: { fontSize: 22, fontWeight: '600', color: '#8e8e93' },

  genderTabSelected: { color: '#101116' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  categoryCard: { width: '48%', height: 100, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f0f0ef', justifyContent: 'flex-start' },
  categoryImg: { width: '100%', height: 100, position: 'absolute', resizeMode:'cover',  right: -0},
  categoryTitle: { fontSize: 18, fontWeight: '700', color: '#101116', zIndex: 2, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', borderRadius: 4 },
  // Style cho phần Виды спорта
  sportCard: {
    width: 160,
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  sportCardImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  sportOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  sportTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    zIndex: 2,
    margin:15
  },
  hitsSection: { marginTop: 24, paddingHorizontal: 16 },
  horizontalScrollContainer: { gap: 12, paddingBottom: 8 },
  productCard: { width: 160, backgroundColor: '#fff', borderRadius: 10 },
  productImageWrapper: { width: '100%', height: 200, backgroundColor: '#f6f6f8', borderRadius: 16, overflow: 'hidden', position: 'relative' },
  productImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  floatingActions: { position: 'absolute', top: 8, right: 8, gap: 6 },
  actionIconBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  productDetailsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  productDiscount: { fontSize: 12, color: '#ff3b30', fontWeight: 'bold' },
  productName: { fontSize: 13, color: '#333', marginTop: 4, height: 36, fontWeight: '500' },
  customBadge: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginVertical: 4 },
  customBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  ratingText: { fontSize: 12, color: '#666', marginTop: 2 },
  blueCartBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#005bff', justifyContent: 'center', alignItems: 'center' },

  servicesGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  serviceItemBox: { width: '23%', alignItems: 'center' },
  serviceIconCircle: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  serviceItemText: { fontSize: 11, textAlign: 'center', color: '#333', fontWeight: '500' },

  dailySectionContainer: { marginTop: 24 },
  purpleCountdownBanner: { backgroundColor: '#5023b0', height: 240, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  countdownLabel: { color: '#fff', fontSize: 18, fontWeight: '600',marginLeft:20, marginBottom:10  },
  timeBoxRow: { backgroundColor: 'rgba(212, 212, 212, 0.69)', borderRadius: 12,  paddingVertical: 10, marginBottom:60,marginLeft:20, width:160 },
  timeNumber: { fontSize: 30, fontWeight: 'bold', color: '#fef8f8', },
  dailyProductsOverlayWrapper: { marginTop: -80, zIndex: 3, paddingLeft:20 },
  timeNumbersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  timeColonText: {
    fontSize: 35,
    color: '#ffffff',
    marginHorizontal: 2,
  },
  timeLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    paddingHorizontal: 2,
  },
  timeLabelText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '500',
    textAlign: 'center',
    width: 28,
  },
});