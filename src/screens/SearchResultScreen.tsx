import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { cartController } from '../controllers/cartController';
import FloatingNavBar from '../components/FloatingNavBar';

export default function SearchResultScreen({ route, navigation }: { route: any; navigation: any }) {
  const { keyword = 'Обувь', results = [] } = route.params || {};

  // Lấy state giỏ hàng để cập nhật badge số lượng
  const cartState = cartController.getCartState();
  const totalCartCount = cartState?.totalItems || 0;

  // Dữ liệu lọc ngang mẫu
  const filterChips = [
    { id: 'f1', type: 'filter', icon: 'options-outline', badge: '1' },
    { id: 'f2', type: 'text', title: 'Способ получения' },
    { id: 'f3', type: 'text', title: 'Акции' },
    { id: 'f4', type: 'text', title: 'Цвет' },
    { id: 'f5', type: 'text', title: 'Бренд' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 1. Header Top Bar */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.searchBarBox} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="search-outline" size={16} color="#8e8e93" style={{ marginRight: 6 }} />
          <Text style={styles.searchText} numberOfLines={1}>{keyword}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chatIconBtn} onPress={() => navigation.navigate('SearchScreen')}>
          <Ionicons name="chatbubble-outline" size={22} color="#111" />
          <View style={styles.redBadge}><Text style={styles.redBadgeText}>4</Text></View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* 2. Title & Total count row */}
        <View style={styles.titleSection}>
          <Text style={styles.screenMainTitle}>{keyword}</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.totalCountText}>{results.length > 0 ? `${results.length} товаров` : '1 349 товаров'}</Text>
            <TouchableOpacity>
              <Ionicons name="share-outline" size={20} color="#111" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Horizontal Filter Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filterChips.map((chip) => {
            if (chip.type === 'filter') {
              return (
                <TouchableOpacity 
                  key={chip.id} 
                  style={styles.filterIconButtonActive}
                  onPress={() => navigation.navigate('Filter')}
                >
                  <Ionicons name="options-outline" size={18} color="#fff" />
                  {chip.badge && (
                    <View style={styles.filterBadge}>
                      <Text style={styles.filterBadgeText}>{chip.badge}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity key={chip.id} style={styles.filterChipItem}>
                <Text style={styles.filterChipText}>{chip.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 4. Product Grid List */}
        <View style={styles.productGrid}>
          {results.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              style={styles.productCard}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            >
              {/* Product Image & Floating Actions */}
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

              {/* Product Info */}
              <View style={styles.productInfoArea}>
                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>{item.price} ₽</Text>
                  {item.oldPrice && <Text style={styles.productOldPrice}>{item.oldPrice} ₽</Text>}
                  {item.discount && <Text style={styles.productDiscount}>{item.discount}</Text>}
                </View>

                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>

                {item.discountTag && (
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagBadgeText}>{item.discountTag}</Text>
                  </View>
                )}

                <View style={styles.cardBottomRow}>
                  <Text style={styles.ratingText}>
                    <Text style={{ color: '#005bff' }}>★</Text> {item.rating || '5.0'} {item.reviewsCount ? `(${item.reviewsCount})` : '(2)'}
                  </Text>

                  <TouchableOpacity 
                    style={styles.blueCartBtn}
                    onPress={() => cartController.addProductToCart(item, 1, item.sizes?.[0] || 'Standard')}
                  >
                    <Ionicons name="cart-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 5. Floating Bottom Navigation Bar */}
      <FloatingNavBar 
        activeTab="Каталог" 
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
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  backBtn: { padding: 4, marginRight: 8 },
  searchBarBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f2f6', borderRadius: 20, paddingHorizontal: 12, height: 40 },
  searchText: { fontSize: 15, color: '#111', fontWeight: '500' },
  chatIconBtn: { position: 'relative', padding: 6, marginLeft: 8 },
  redBadge: { position: 'absolute', right: 2, top: 2, width: 16, height: 16, borderRadius: 8, backgroundColor: '#ff3b30', justifyContent: 'center', alignItems: 'center' },
  redBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },

  titleSection: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  screenMainTitle: { fontSize: 24, fontWeight: 'bold', color: '#111', marginBottom: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalCountText: { fontSize: 13, color: '#8e8e93' },

  filterScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterIconButtonActive: { width: 40, height: 40, backgroundColor: '#005bff', borderRadius: 12, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  filterBadge: { position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: '#ff3b30', justifyContent: 'center', alignItems: 'center' },
  filterBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  filterChipItem: { height: 40, backgroundColor: '#f6f6f8', borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  filterChipText: { fontSize: 14, fontWeight: '500', color: '#333' },

  productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, justifyContent: 'space-between', marginTop: 4 },
  productCard: { width: '48.5%', backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, padding: 8, borderWidth: 1, borderColor: '#f1f2f6' },
  productImageWrapper: { width: '100%', height: 180, backgroundColor: '#f6f6f8', borderRadius: 12, overflow: 'hidden', position: 'relative' },
  productImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  floatingActions: { position: 'absolute', top: 8, right: 8, gap: 6 },
  actionIconBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },

  productInfoArea: { marginTop: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  productOldPrice: { fontSize: 12, color: '#888', textDecorationLine: 'line-through' },
  productDiscount: { fontSize: 12, color: '#ff3b30', fontWeight: 'bold' },
  productName: { fontSize: 13, color: '#333', marginTop: 4, height: 36, fontWeight: '500' },
  tagBadge: { alignSelf: 'flex-start', backgroundColor: '#ffebe8', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginVertical: 4 },
  tagBadgeText: { color: '#d9381e', fontSize: 10, fontWeight: 'bold' },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  ratingText: { fontSize: 12, color: '#666' },
  blueCartBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#005bff', justifyContent: 'center', alignItems: 'center' },
});