import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { productController } from '../controllers/productController';
import { cartController } from '../controllers/cartController';
import FloatingNavBar from '../components/FloatingNavBar';

export default function CartScreen({ navigation }: { navigation: any }) {
  const hitProducts = productController.getProducts({}).slice(0, 4);
  const location = 'Томск, Буяновский переулок, 3А';

  // State lưu trữ dữ liệu giỏ hàng thực tế
  const [cartState, setCartState] = useState<any>({ items: [] });

  // Tự động làm mới giỏ hàng mỗi khi chuyển tab sang màn hình Giỏ hàng
  useFocusEffect(
    useCallback(() => {
      try {
        const currentCart = cartController.getCartState();
        setCartState(currentCart || { items: [] });
      } catch (error) {
        setCartState({ items: [] });
      }
    }, [])
  );

  const cartItems = cartState?.items || [];
  const cartItemsCount = cartItems.reduce((sum: number, item: any) => sum + (item?.quantity || 0), 0);

  // Xử lý thay đổi số lượng sản phẩm trong giỏ
  const handleUpdateQuantity = (cartItemId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty <= 0) {
      cartController.removeItem(cartItemId);
    } else {
      cartController.changeItemQuantity(cartItemId, newQty);
    }
    // Cập nhật lại state trực tiếp
    setCartState(cartController.getCartState() || { items: [] });
  };

  // Tính tổng tiền giỏ hàng
  const totalPrice = cartItems.reduce((sum: number, item: any) => {
    const cleanPrice = parseInt(String(item?.product?.price || '0').replace(/[^0-9]/g, ''), 10) || 0;
    return sum + cleanPrice * (item?.quantity || 1);
  }, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Корзина</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.locationBar}>
          <View style={styles.locationPin}>
            <Ionicons name="location-sharp" size={14} color="#fff" />
          </View>
          <Text style={styles.locationText} numberOfLines={1}>
            {location}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#888" />
        </TouchableOpacity>

        {/* NẾU GIỎ HÀNG TRỐNG */}
        {cartItemsCount === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.illustrationWrapper}>
              <Image 
                source={require('../constants/cart_image.png')} 
                style={styles.emptyCartImage} 
                resizeMode="contain" 
              />
            </View>

            <Text style={styles.emptyTitle}>Вы пока не добавили товары</Text>

            <TouchableOpacity 
              style={styles.startShoppingBtn}
              onPress={() => navigation.navigate('CatelogyTab')}
            >
              <Text style={styles.startShoppingText}>Начать покупки</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* NẾU ĐÃ CÓ SẢN PHẨM TRONG GIỎ */
          <View style={styles.cartListContainer}>
            {cartItems.map((item: any, index: number) => (
              <View key={item?.id || index} style={styles.cartItemCard}>
                <Image 
                  source={{ uri: item?.product?.images?.[0] }} 
                  style={styles.cartItemImg} 
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cartItemName} numberOfLines={2}>
                    {item?.product?.name}
                  </Text>
                  <Text style={styles.cartItemSize}>Размер: {item?.size || 'Standard'}</Text>
                  
                  <View style={styles.cardBottomRow}>
                    <Text style={styles.cartItemPrice}>{item?.product?.price} ₽</Text>
                    
                    {/* Bộ tăng giảm số lượng */}
                    <View style={styles.qtyCounterBox}>
                      <TouchableOpacity 
                        style={styles.qtyActionBtn}
                        onPress={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                      >
                        <Ionicons name="remove" size={16} color="#111" />
                      </TouchableOpacity>
                      <Text style={styles.qtyNumberText}>{item.quantity}</Text>
                      <TouchableOpacity 
                        style={styles.qtyActionBtn}
                        onPress={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                      >
                        <Ionicons name="add" size={16} color="#111" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {/* Khối tổng kết thanh toán */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Товары ({cartItemsCount})</Text>
                <Text style={styles.summaryValue}>{totalPrice} ₽</Text>
              </View>
              <View style={[styles.summaryRow, { marginTop: 8 }]}>
                <Text style={styles.summaryTotalLabel}>Итого</Text>
                <Text style={styles.summaryTotalValue}>{totalPrice} ₽</Text>
              </View>
              <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.8}>
                <Text style={styles.checkoutBtnText}>Оформить заказ</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* PHẦN HIỂN THỊ HỊ BÁN CHẠY (HITS) */}
        <View style={styles.hitsSection}>
          <Text style={styles.hitsTitle}>Хиты продаж</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContainer}>
            {hitProducts.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.productCard}
                onPress={() => navigation.navigate('CatelogyTab')}
              >
                <View style={styles.productImageWrapper}>
                  <Image source={{ uri: item.images[0] }} style={styles.productImg} />
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
      </ScrollView>

      <FloatingNavBar 
        activeTab="Корзина"
        cartCount={cartItemsCount}
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
  header: { paddingVertical: 12, alignItems: 'center', borderBottomWidth: 1, borderColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f8',
    marginHorizontal: 16,
    marginTop: 14,
    padding: 12,
    borderRadius: 16,
  },
  locationPin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#005bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  locationText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#111' },
  
  /* Trạng thái trống */
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 10,
  },
  illustrationWrapper: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  emptyCartImage: {
    width: 240,
    height: 180,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginVertical: 16,
    textAlign: 'center',
  },
  startShoppingBtn: {
    backgroundColor: '#005bff',
    paddingHorizontal: 32,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startShoppingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  /* Danh sách sản phẩm trong giỏ */
  cartListContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9fb',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  cartItemImg: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#eee',
    resizeMode: 'cover',
  },
  cartItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  cartItemSize: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005bff',
  },
  qtyCounterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 4,
  },
  qtyActionBtn: {
    padding: 6,
  },
  qtyNumberText: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111',
  },

  /* Tổng kết giỏ hàng */
  summaryCard: {
    backgroundColor: '#f6f6f8',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005bff',
  },
  checkoutBtn: {
    backgroundColor: '#005bff',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /* Phần gợi ý sản phẩm (Hits) */
  hitsSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  hitsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    marginBottom: 16,
  },
  horizontalScrollContainer: {
    gap: 12,
    paddingBottom: 8,
  },
  productCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  productImageWrapper: {
    width: '100%',
    height: 220,
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
  productDiscount: { fontSize: 12, color: '#ff3b30', fontWeight: 'bold' },
  productName: { fontSize: 13, color: '#333', marginTop: 4, height: 36, fontWeight: '500' },
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