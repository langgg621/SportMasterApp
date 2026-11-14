import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { userController } from '../controllers/userController';
import { productController } from '../controllers/productController';

import { ProfileClubCard } from '../components/ProfileClubCard';
import { ProfileProductList } from '../components/ProfileProductList';
import { ProfileMenuItem, Product } from '../models';

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth(); // Lấy thông tin user thật
  const { addToCart } = useCart();
  
  const [menuItems, setMenuItems] = useState<ProfileMenuItem[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [schoolClothing, setSchoolClothing] = useState<Product[]>([]);
  
  const unreadChat = 0; // Giả lập, nếu có API chat thì thay vào

  const scrollY = useRef(new Animated.Value(0)).current;
  const cardHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [420, 240],
    extrapolate: 'clamp',
  });

  // Gọi API lấy Menu và Sản phẩm gợi ý
  useEffect(() => {
    // 1. Lấy menu profile
    userController.getProfileMenu()
      .then(setMenuItems)
      .catch(console.error);

    // 2. Lấy sản phẩm mới / gợi ý
    productController.getByFlag('new_collection', 5)
      .then(setRecentProducts)
      .catch(console.error);

    productController.getByFlag('best_price', 5)
      .then(setSchoolClothing)
      .catch(console.error);
  }, []);

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
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        <View style={styles.topSection}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.locationBar}>
              <View style={styles.locationPin}>
                <Ionicons name="location-sharp" size={13} color="#fff" />
              </View>
              <Text style={styles.locationText} numberOfLines={1}>{user?.address || 'Томск, Буяновский переулок, 3А'}</Text>
              <Ionicons name="chevron-forward" size={16} color="#888" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate('SearchScreen')}>
              <Ionicons name="chatbubble-outline" size={22} color="#111" />
              {unreadChat > 0 && <View style={styles.chatBadge}><Text style={styles.chatBadgeText}>{unreadChat}</Text></View>}
            </TouchableOpacity>
          </View>

          <View style={styles.profileHeader}>
            <Text style={styles.userNameText}>{user?.fullName || 'ГОСТЬ'}</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil-outline" size={18} color="#aaa" />
            </TouchableOpacity>
          </View>

          {/* Component Thẻ Club Card */}
          <ProfileClubCard profile={user} cardHeight={cardHeight} />
        </View>

        <View style={styles.bottomSheetWrapper}>
          <View style={styles.handleWrapper}><View style={styles.dragHandle} /></View>
          
          {/* Menu Items */}
          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem} activeOpacity={0.7}>
                <Ionicons name={(item.icon as any) || 'list-outline'} size={22} color="#005bff" style={styles.menuIcon} />
                <Text style={styles.menuTitle}>{item.title}</Text>
                {item.badgeText && <View style={styles.blueBadge}><Text style={styles.blueBadgeText}>{item.badgeText}</Text></View>}
                {item.isNew && <View style={styles.redNewBadge}><Text style={styles.redNewBadgeText}>New</Text></View>}
              </TouchableOpacity>
            ))}
          </View>

          {/* Danh sách sản phẩm gợi ý */}
          <ProfileProductList 
            title="Вы недавно смотрели" 
            products={recentProducts} 
            onProductPress={(id) => navigation.navigate('ProductDetail', { productId: id })}
            onAddToCart={handleQuickAdd}
          />
          
          <ProfileProductList 
            title="Одежда и экипировка" 
            products={schoolClothing} 
            onProductPress={(id) => navigation.navigate('ProductDetail', { productId: id })}
            onAddToCart={handleQuickAdd}
          />
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
});