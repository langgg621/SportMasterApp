import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FloatingNavBar from '../components/FloatingNavBar';

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const userName = 'ЛИНЬ';
  const bonusPoints = 200;
  const bonusExpiry = '20.03.2027';
  const location = 'Томск, Буяновский переулок, 3А';

  const scrollY = useRef(new Animated.Value(0)).current;

  const cardHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [420, 240],
    extrapolate: 'clamp',
  });

  const menuItems = [
    { id: '1', title: 'Мои заказы', icon: 'cube-outline', badge: null, isNew: false },
    { id: '2', title: 'Мои возвраты', icon: 'refresh-outline', badge: null, isNew: false },
    { id: '3', title: 'Мои разряды', icon: 'ribbon-outline', badge: null, isNew: false },
    { id: '4', title: 'Промокоды и акции', icon: 'ticket-outline', badge: null, isNew: false },
    { id: '5', title: 'Мои скидки', icon: 'pricetag-outline', badge: '4', isNew: true },
    { id: '6', title: 'Семейный счёт', icon: 'people-outline', badge: null, isNew: true },
    { id: '7', title: 'Витрина предложений', icon: 'grid-outline', badge: null, isNew: true },
    { id: '8', title: 'Список сравнения', icon: 'stats-chart-outline', badge: null, isNew: false },
    { id: '9', title: 'Избранное', icon: 'heart-outline', badge: null, isNew: false },
    { id: '10', title: 'Мои магазины', icon: 'location-outline', badge: null, isNew: false },
    { id: '11', title: 'Адреса доставки', icon: 'map-outline', badge: null, isNew: false },
    { id: '12', title: 'История просмотров', icon: 'time-outline', badge: null, isNew: false },
    { id: '13', title: 'Управление подписками', icon: 'settings-outline', badge: null, isNew: false },
    { id: '14', title: 'Мои интересы', icon: 'star-outline', badge: null, isNew: true },
    { id: '15', title: 'Пригласи друга', icon: 'person-add-outline', badge: null, isNew: true },
    { id: '16', title: 'Стать продавцом', icon: 'briefcase-outline', badge: null, isNew: false },
    { id: '17', title: 'Информация', icon: 'information-circle-outline', badge: null, isNew: false },
  ];

  const recentProducts = [
    {
      id: 'p1',
      name: 'Кроссовки мужские PUMA St Runner V3 L',
      price: '6 199 ₽',
      oldPrice: '7 999 ₽',
      discount: '-23%',
      rating: '4.3 (3412)',
      tag: 'Только у нас',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    },
    {
      id: 'p2',
      name: 'Кроссовки беговые Demix Thunder',
      price: '3 499 ₽',
      oldPrice: '4 999 ₽',
      discount: '-30%',
      rating: '4.7 (850)',
      tag: '',
      image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400',
    },
  ];

  const schoolClothing = [
    {
      id: 'sc1',
      name: 'Футболка для девочек Demix',
      price: '99 ₽',
      oldPrice: '299 ₽',
      discount: '-67%',
      rating: '4.8 (1470)',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    },
    {
      id: 'sc2',
      name: 'Поло детское Demix',
      price: '699 ₽',
      rating: '5.0 (38)',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
    },
    {
      id: 'sc3',
      name: 'Спортивный костюм детский Outventure',
      price: '2 499 ₽',
      oldPrice: '3 299 ₽',
      discount: '-24%',
      rating: '4.9 (120)',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    },
  ];

  // Component render danh sách sản phẩm cuộn ngang dùng chung
  const renderProductScroll = (products: any[]) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContainer}>
      {products.map((p) => (
        <View key={p.id} style={styles.productCard}>
          <View style={styles.productImageWrapper}>
            <Image source={{ uri: p.image }} style={styles.productImg} />
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
                <Text style={styles.productPrice}>{p.price}</Text>
                {p.oldPrice && <Text style={styles.productOldPrice}>{p.oldPrice}</Text>}
                {p.discount && <Text style={styles.productDiscount}>{p.discount}</Text>}
              </View>
              <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
              {p.tag ? <Text style={styles.tagText}>{p.tag}</Text> : null}
              <Text style={styles.ratingText}><Text style={{ color: '#086ee7' }}>★</Text> {p.rating}</Text>
            </View>

            <TouchableOpacity style={styles.blueCartBtn}>
              <Ionicons name="cart-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* PHẦN NỀN TRẮNG CHÍNH */}
        <View style={styles.topSection}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.locationBar}>
              <View style={styles.locationPin}>
                <Ionicons name="location-sharp" size={13} color="#fff" />
              </View>
              <Text style={styles.locationText} numberOfLines={1}>
                {location}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#888" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate('SearchScreen')}>
              <Ionicons name="chatbubble-outline" size={22} color="#111" />
              <View style={styles.chatBadge}><Text style={styles.chatBadgeText}>6</Text></View>
            </TouchableOpacity>
          </View>

          <View style={styles.profileHeader}>
            <Text style={styles.userNameText}>{userName}</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil-outline" size={18} color="#aaa" />
            </TouchableOpacity>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Укажите данные о себе и детях</Text>
              <Ionicons name="information-circle-outline" size={18} color="#aaa" />
            </View>
            <Text style={styles.progressSub}>И получайте бонусы для всей семьи</Text>

            <View style={styles.progressBarRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <View key={i} style={[styles.progressSegment, styles.activeSegment]} />
              ))}
              <View style={[styles.progressSegment, styles.inactiveSegment]} />
              <Text style={styles.progressCount}>5 / 6</Text>
            </View>
          </View>

          {/* THẺ CLUB CARD XANH DƯƠNG */}
          <Animated.View style={[styles.blueCard, { height: cardHeight }]}>
            <View style={styles.bonusLeftRow}>
              <Text style={styles.bonusNumber}>{bonusPoints}</Text>
              <View style={styles.coinCircle}>
                <Ionicons name="flash" size={12} color="#005bff" />
              </View>
              <Ionicons name="chevron-forward" size={20} color="#fff" style={{ marginLeft: 4 }} />
            </View>

            <View style={styles.bonusBadge}>
              <Text style={styles.bonusBadgeText}>🔥 {bonusPoints} бонусов до {bonusExpiry}</Text>
            </View>

            <View style={styles.qrWhiteBox}>
              <Image 
                source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SPORTMASTER_LINH' }} 
                style={styles.qrImage}
              />
            </View>

            <TouchableOpacity style={styles.refreshBtn}>
              <Ionicons name="refresh-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.refreshText}>Обновить код</Text>
            </TouchableOpacity>

            <View style={styles.cardFooterRow}>
              <View style={styles.footerCol}>
                <Text style={styles.footerLabel}>Уровень участия</Text>
                <Text style={styles.footerValue}>Стандартный</Text>
              </View>
              <View style={styles.footerColRight}>
                <Text style={styles.footerLabel}>Кешбэк</Text>
                <Text style={styles.footerValue}>5% бонусами</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* BOTTOM SHEET TRẮNG */}
        <View style={styles.bottomSheetWrapper}>
          <View style={styles.handleWrapper}>
            <View style={styles.dragHandle} />
          </View>

          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                activeOpacity={0.7}
              >
                <Ionicons name={item.icon as any} size={22} color="#005bff" style={styles.menuIcon} />
                <Text style={styles.menuTitle}>{item.title}</Text>

                {item.badge && (
                  <View style={styles.blueBadge}>
                    <Text style={styles.blueBadgeText}>{item.badge}</Text>
                  </View>
                )}

                {item.isNew && (
                  <View style={styles.redNewBadge}>
                    <Text style={styles.redNewBadgeText}>New</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* MỤC 1: Вы недавно смотрели */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>Вы недавно смотрели</Text>
            {renderProductScroll(recentProducts)}
          </View>

          {/* MỤC 2: Одежда на прогулку, в садик и школу */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>Одежда на прогулку, в садик и школу</Text>
            {renderProductScroll(schoolClothing)}
          </View>
        </View>
      </Animated.ScrollView>

      <FloatingNavBar 
        activeTab="Профиль"
        onTabPress={(tab) => {
          if (tab === 'Главная') navigation.navigate('HomeTab');
          if (tab === 'Каталог') navigation.navigate('CatelogyTab');
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
  container: { flex: 1, backgroundColor: '#fff' },
  
  topSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f2f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  locationPin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#005bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  locationText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#111' },

  chatBtn: { position: 'relative', padding: 6 },
  chatBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#f3203d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBadgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userNameText: { fontSize: 32, fontWeight: '900', color: '#111', fontStyle: 'italic', letterSpacing: 0.5 },
  editBtn: { marginLeft: 8 },

  progressCard: {
    backgroundColor: '#f8f7fe',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressTitle: { fontSize: 14, fontWeight: 'bold', color: '#111' },
  progressSub: { fontSize: 12, color: '#666', marginTop: 2, marginBottom: 10 },
  progressBarRow: { flexDirection: 'row', alignItems: 'center' },
  progressSegment: { flex: 1, height: 4, borderRadius: 2, marginRight: 4 },
  activeSegment: { backgroundColor: '#613bea' },
  inactiveSegment: { backgroundColor: '#e2d9fc' },
  progressCount: { fontSize: 12, fontWeight: 'bold', color: '#666', marginLeft: 6 },

  blueCard: {
    backgroundColor: '#005bff',
    borderRadius: 24,
    padding: 20,
    alignItems: 'flex-start',
    overflow: 'hidden',
    position: 'relative',
  },
  bonusLeftRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  bonusNumber: { fontSize: 36, fontWeight: '900', color: '#fff' },
  coinCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffcc00',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  bonusBadge: {
    backgroundColor: '#e53238',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
  },
  bonusBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  qrWhiteBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    alignSelf: 'center',
    marginBottom: 12,
  },
  qrImage: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  refreshText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
  },
  footerCol: { alignItems: 'flex-start' },
  footerColRight: { alignItems: 'flex-end' },
  footerLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  footerValue: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginTop: 2 },

  bottomSheetWrapper: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -80,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  handleWrapper: {
    alignItems: 'center',
    marginBottom: 8,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#d1d1d6',
    borderRadius: 2,
  },
  menuList: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: '#f0f0f0',
  },
  menuIcon: { marginRight: 14 },
  menuTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#111' },
  blueBadge: {
    backgroundColor: '#005bff',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  blueBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  redNewBadge: {
    backgroundColor: '#f3203d',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  redNewBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeading: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 16 },
  horizontalScrollContainer: {
    gap: 12,
    paddingBottom: 8,
  },

  /* Styles dùng chung cho card sản phẩm cuộn ngang */
  productCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
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
    top: 10,
    right: 10,
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
  productOldPrice: { fontSize: 12, color: '#888', textDecorationLine: 'line-through' },
  productDiscount: { fontSize: 12, color: '#ff3b30', fontWeight: 'bold' },
  productName: { fontSize: 13, color: '#333', marginTop: 4, height: 36, fontWeight: '500' },
  tagText: { fontSize: 11, color: '#ff3b30', marginTop: 2, fontWeight: '600' },
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