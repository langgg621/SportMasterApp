import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useFloatingNav } from '../hooks/useFloatingNav'; // Import hook điều hướng
import { userController } from '../controllers/userController';
import { productController } from '../controllers/productController';

import { ProfileClubCard } from '../components/ProfileClubCard';
import { ProfileProductList } from '../components/ProfileProductList';
import { ProfileLoginPrompt } from '../components/ProfileLoginPrompt';
import FloatingNavBar from '../components/FloatingNavBar'; // Import thanh floating bar
import { ProfileMenuItem, Product } from '../models';

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth(); 
  const { addToCart } = useCart();
  const floatingNav = useFloatingNav(navigation); // Khởi tạo logic chuyển tab
  
  const [menuItems, setMenuItems] = useState<ProfileMenuItem[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [schoolClothing, setSchoolClothing] = useState<Product[]>([]);

  const scrollY = useRef(new Animated.Value(0)).current;
  const cardHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [420, 240],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (user) {
      userController.getProfileMenu().then(setMenuItems).catch(console.error);
    }
    productController.getByFlag('new_collection', 5).then(setRecentProducts).catch(console.error);
    productController.getByFlag('best_price', 5).then(setSchoolClothing).catch(console.error);
  }, [user]);

  const handleQuickAdd = async (product: Product) => {
    const firstSize = product.sizes?.[0]?.sizeID;
    if (!firstSize) return alert('Нет в наличии');
    try {
      await addToCart(product.id, firstSize, product.colors?.[0]?.colorID || null, 1);
      alert('Добавлено в корзину!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* ==========================================
          NẾU CHƯA ĐĂNG NHẬP: HIỂN THỊ MÀN LOGIN PROMPT
          ========================================== */}
      {!user ? (
        <View style={{ flex: 1, paddingBottom: 100 }}> {/* paddingBottom để không bị thanh Nav che */}
          <View style={styles.guestHeader}>
            <TouchableOpacity style={styles.locationBar}>
              <View style={styles.locationPin}>
                <Ionicons name="location-sharp" size={13} color="#fff" />
              </View>
              <Text style={styles.locationText} numberOfLines={1}>Томск, Буяновский переулок, 3А</Text>
              <Ionicons name="chevron-forward" size={16} color="#888" />
            </TouchableOpacity>

            {/* Thẻ TouchableOpacity cho nút chat */}
            <TouchableOpacity style={styles.chatBtn}>
              <Ionicons name="chatbubble-outline" size={22} color="#111" />
            </TouchableOpacity>
          </View>

          <View style={styles.guestTitleBox}>
            <Text style={styles.guestTitle}>ВОЙДИТЕ</Text>
            <Text style={styles.guestSubtitle}>Чтобы получать скидки, использовать бонусы и отслеживать заказы</Text>
          </View>

          <ProfileLoginPrompt onLoginPress={() => navigation.navigate('LoginScreen')} />
        </View>
      ) : (
        
        /* ==========================================
           NẾU ĐÃ ĐĂNG NHẬP: HIỂN THỊ MÀN PROFILE
           ========================================== */
        <Animated.ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 130 }} // Đủ khoảng trống cho thanh Nav
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
        >
          <View style={styles.topSection}>
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.locationBar}>
                <View style={styles.locationPin}>
                  <Ionicons name="location-sharp" size={13} color="#fff" />
                </View>
                <Text style={styles.locationText} numberOfLines={1}>{user.address || 'Томск, Буяновский переулок, 3А'}</Text>
                <Ionicons name="chevron-forward" size={16} color="#888" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate('SearchScreen')}>
                <Ionicons name="chatbubble-outline" size={22} color="#111" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileHeader}>
              <Text style={styles.userNameText}>{user.fullName}</Text>
              <TouchableOpacity style={styles.editBtn}>
                <Ionicons name="pencil-outline" size={18} color="#aaa" />
              </TouchableOpacity>
            </View>

            <ProfileClubCard profile={user} cardHeight={cardHeight} />
          </View>

          <View style={styles.bottomSheetWrapper}>
            <View style={styles.handleWrapper}><View style={styles.dragHandle} /></View>
                        
            // Trong ProfileScreen.tsx, tìm đến đoạn render menu:
            <View style={styles.menuList}>
              {menuItems.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.menuItem} 
                  activeOpacity={0.7}
                  onPress={() => {
                    // KIỂM TRA NẾU BẤM VÀO "МОИ ЗАКАЗЫ" THÌ CHUYỂN TRANG
                    if (item.title === 'Мои заказы') {
                      navigation.navigate('OrderHistory');
                    }
                  }}
                >
                  <Ionicons 
                    name={(item.icon as any) || 'list-outline'} 
                    size={22} 
                    color="#005bff" 
                    style={styles.menuIcon} 
                  />
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  
                  {/* Badge số màu xanh */}
                  {item.badgeText && (
                    <View style={styles.blueBadge}>
                      <Text style={styles.blueBadgeText}>{item.badgeText}</Text>
                    </View>
                  )}

                  {/* Badge chữ New màu đỏ */}
                  {item.isNew && (
                    <View style={styles.redNewBadge}>
                      <Text style={styles.redNewBadgeText}>New</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <ProfileProductList 
              title="Вы недавно смотрели" 
              products={recentProducts} 
              onProductPress={(id) => navigation.navigate('ProductDetail', { productId: id })}
              onAddToCart={handleQuickAdd}
            />
          </View>
        </Animated.ScrollView>
      )}

      {/* THANH FLOATING NAVBAR LUÔN HIỂN THỊ Ở DƯỚI CÙNG */}
      <FloatingNavBar activeTab="Профиль" {...floatingNav} />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  // Style cho Khách
  guestHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  guestTitleBox: { paddingHorizontal: 16, marginTop: 20, marginBottom: 20 },
  guestTitle: { fontSize: 36, fontWeight: '900', fontStyle: 'italic', color: '#111', marginBottom: 12 },
  guestSubtitle: { fontSize: 16, color: '#444', lineHeight: 22 },

  // Style cho User
  topSection: { backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  locationBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f2f6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  locationPin: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#005bff', justifyContent: 'center', alignItems: 'center', marginRight: 6 },
  locationText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#111' },
  chatBtn: { position: 'relative', padding: 6 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  userNameText: { fontSize: 32, fontWeight: '900', color: '#111', fontStyle: 'italic' },
  editBtn: { marginLeft: 8 },
  bottomSheetWrapper: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -80, paddingTop: 10 },
  handleWrapper: { alignItems: 'center', marginBottom: 8 },
  dragHandle: { width: 36, height: 4, backgroundColor: '#d1d1d6', borderRadius: 2 },
  menuList: { paddingHorizontal: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 0.5, borderColor: '#f0f0f0' },
  menuIcon: { marginRight: 14 },
  menuTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#111' },
    // Thêm vào phần styles của ProfileScreen
  blueBadgeText: { 
    color: '#fff', 
    fontSize: 11, 
    fontWeight: 'bold' 
  },
  redNewBadgeText: { 
    color: '#fff', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
    blueBadge: { 
    backgroundColor: '#005bff', 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 10, 
    marginLeft: 8 
  },
  redNewBadge: { 
    backgroundColor: '#f3203d', 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 4, 
    marginLeft: 8 
  },
});