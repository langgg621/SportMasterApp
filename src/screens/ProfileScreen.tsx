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
import { userController } from '../controllers/userController';
import { productController } from '../controllers/productController';
import { cartController } from '../controllers/cartController';
import { useCart } from '../hooks/useCart';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
export default function ProfileScreen({ navigation }: { navigation: any }) {
  // Lấy dữ liệu profile từ userController
  const profile = userController.getUserProfile();
  
  // Lấy danh sách sản phẩm gợi ý / đã xem từ productController
  const recentProducts = productController.getProducts({}).slice(0, 2);
  const schoolClothing = productController.getProducts({}).slice(2, 5);

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

  const { totalCount: totalCartCount, refresh: refreshCart } = useCart();

  const renderProductScroll = (products: any[]) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContainer}>
      {products.map((p) => (
        <TouchableOpacity 
          key={p.id} 
          style={styles.productCard}
          onPress={() => navigation.navigate('ProductDetail', { productId: p.id })}
        >
          <View style={styles.productImageWrapper}>
            <Image source={{ uri: p.images[0] }} style={styles.productImg} />
            <View style={styles.floatingActions}>
              <TouchableOpacity style={styles.actionIconBtn}>
                      <Ionicons name="heart-outline" size={16} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionIconBtn}>
                    <MaterialCommunityIcons name="scale-unbalanced" size={16} color="#666" />

                    </TouchableOpacity>
            </View>
          </View>

          <View style={styles.productDetailsRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.priceContainer}>
                <Text style={styles.productPrice}>{p.price} ₽</Text>
                {p.oldPrice && <Text style={styles.productOldPrice}>{p.oldPrice} ₽</Text>}
                {p.discount && <Text style={styles.productDiscount}>{p.discount}</Text>}
              </View>
              <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
              <Text style={styles.ratingText}><Text style={{ color: '#086ee7' }}>★</Text> {p.rating} ({p.reviewsCount})</Text>
            </View>

            <TouchableOpacity 
              style={styles.blueCartBtn}
              onPress={() => { cartController.addProductToCart(p, 1, p.sizes?.[0] || 'Standard'); refreshCart(); }}
            >
              <Ionicons name="cart-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
        <View style={styles.topSection}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.locationBar}>
              <View style={styles.locationPin}>
                <Ionicons name="location-sharp" size={13} color="#fff" />
              </View>
              <Text style={styles.locationText} numberOfLines={1}>{profile.location}</Text>
              <Ionicons name="chevron-forward" size={16} color="#888" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate('SearchScreen')}>
              <Ionicons name="chatbubble-outline" size={22} color="#111" />
              <View style={styles.chatBadge}><Text style={styles.chatBadgeText}>1</Text></View>
            </TouchableOpacity>
          </View>

          <View style={styles.profileHeader}>
            <Text style={styles.userNameText}>{profile.name}</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil-outline" size={18} color="#aaa" />
            </TouchableOpacity>
          </View>

          {/* THẺ CLUB CARD XANH DƯƠNG */}
          <Animated.View style={[styles.blueCard, { height: cardHeight }]}>
            <View style={styles.bonusLeftRow}>
              <Text style={styles.bonusNumber}>{profile.bonusPoints}</Text>
              <View style={styles.coinCircle}>
                <Ionicons name="flash" size={12} color="#005bff" />
              </View>
            </View>

            <View style={styles.bonusBadge}>
              <Text style={styles.bonusBadgeText}>🔥 {profile.bonusPoints} бонусов до {profile.bonusExpiry}</Text>
            </View>

            <View style={styles.qrWhiteBox}>
              <Image 
                source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SPORTMASTER_${profile.name}` }} 
                style={styles.qrImage}
              />
            </View>

            <View style={styles.cardFooterRow}>
              <View style={styles.footerCol}>
                <Text style={styles.footerLabel}>Уровень участия</Text>
                <Text style={styles.footerValue}>{profile.clubLevel}</Text>
              </View>
              <View style={styles.footerColRight}>
                <Text style={styles.footerLabel}>Кешбэк</Text>
                <Text style={styles.footerValue}>{profile.cashback}</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        <View style={styles.bottomSheetWrapper}>
          <View style={styles.handleWrapper}><View style={styles.dragHandle} /></View>
          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem} activeOpacity={0.7}>
                <Ionicons name={item.icon as any} size={22} color="#005bff" style={styles.menuIcon} />
                <Text style={styles.menuTitle}>{item.title}</Text>
                {item.badge && <View style={styles.blueBadge}><Text style={styles.blueBadgeText}>{item.badge}</Text></View>}
                {item.isNew && <View style={styles.redNewBadge}><Text style={styles.redNewBadgeText}>New</Text></View>}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>Вы недавно смотрели</Text>
            {renderProductScroll(recentProducts)}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>Одежда и экипировка</Text>
            {renderProductScroll(schoolClothing)}
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topSection: { backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  locationBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f2f6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  locationPin: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#005bff', justifyContent: 'center', alignItems: 'center', marginRight: 6 },
  locationText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#111' },
  chatBtn: { position: 'relative', padding: 6 },
  chatBadge: { position: 'absolute', right: 0, top: 0, width: 18, height: 18, borderRadius: 9, backgroundColor: '#f3203d', justifyContent: 'center', alignItems: 'center' },
  chatBadgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  userNameText: { fontSize: 32, fontWeight: '900', color: '#111', fontStyle: 'italic' },
  editBtn: { marginLeft: 8 },
  blueCard: { backgroundColor: '#005bff', borderRadius: 24, padding: 20, alignItems: 'flex-start', overflow: 'hidden' },
  bonusLeftRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  bonusNumber: { fontSize: 36, fontWeight: '900', color: '#fff' },
  coinCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#ffcc00', justifyContent: 'center', alignItems: 'center', marginLeft: 6 },
  bonusBadge: { backgroundColor: '#e53238', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 16 },
  bonusBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  qrWhiteBox: { backgroundColor: '#fff', borderRadius: 20, padding: 12, alignSelf: 'center', marginBottom: 12 },
  qrImage: { width: 160, height: 160, resizeMode: 'contain' },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 4 },
  footerCol: { alignItems: 'flex-start' },
  footerColRight: { alignItems: 'flex-end' },
  footerLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  footerValue: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginTop: 2 },
  bottomSheetWrapper: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -80, paddingTop: 10 },
  handleWrapper: { alignItems: 'center', marginBottom: 8 },
  dragHandle: { width: 36, height: 4, backgroundColor: '#d1d1d6', borderRadius: 2 },
  menuList: { paddingHorizontal: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 0.5, borderColor: '#f0f0f0' },
  menuIcon: { marginRight: 14 },
  menuTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#111' },
  blueBadge: { backgroundColor: '#005bff', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 6 },
  blueBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  redNewBadge: { backgroundColor: '#f3203d', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  redNewBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  sectionContainer: { marginTop: 24, paddingHorizontal: 16 },
  sectionHeading: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 16 },
  horizontalScrollContainer: { gap: 12, paddingBottom: 8 },
  productCard: { width: 160, backgroundColor: '#fff', borderRadius: 16 },
  productImageWrapper: { width: '100%', height: 220, backgroundColor: '#f6f6f8', borderRadius: 16, overflow: 'hidden' },
  productImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  floatingActions: { position: 'absolute', top: 10, right: 10 },
  actionIconBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  productDetailsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  productOldPrice: { fontSize: 12, color: '#888', textDecorationLine: 'line-through' },
  productDiscount: { fontSize: 12, color: '#ff3b30', fontWeight: 'bold' },
  productName: { fontSize: 13, color: '#333', marginTop: 4, height: 36, fontWeight: '500' },
  ratingText: { fontSize: 12, color: '#666', marginTop: 2 },
  blueCartBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#005bff', justifyContent: 'center', alignItems: 'center' },
});