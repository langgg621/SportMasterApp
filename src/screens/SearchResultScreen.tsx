import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { cartController } from '../controllers/cartController';
import FloatingNavBar from '../components/FloatingNavBar';
import { productController } from '../controllers/productController';
import { Product } from '../models/product';

export default function SearchResultScreen({ route, navigation }: { route: any; navigation: any }) {  
  const { keyword, results: initialResults } = route.params || {};
  
  // Lấy state giỏ hàng để cập nhật badge số lượng
  const cartState = cartController.getCartState();
  const totalCartCount = cartState?.totalItems || 0;
  
  const [currentSort, setCurrentSort] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');
  const [productList, setProductList] = useState<Product[]>(initialResults || []);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  // Dữ liệu lọc ngang mẫu
  const filterChips = [
    { id: 'f1', type: 'filter', icon: 'options-outline', badge: '1' },
    { id: 'f2', type: 'text', title: 'Способ получения' },
    { id: 'f3', type: 'text', title: 'Акции' },
    { id: 'f4', type: 'text', title: 'Цвет' },
    { id: 'f5', type: 'text', title: 'Бренд' },
  ];

  // Danh sách các tùy chọn sắp xếp chuẩn Sportmaster
  const sortOptions = [
    { id: 'popular', label: 'По популярности' },
    { id: 'price_asc', label: 'По возрастанию цены' },
    { id: 'price_desc', label: 'По убыванию цены' },
    { id: 'rating', label: 'По рейтингу' },
  ];

  // Xử lý khi chọn một kiểu sắp xếp
  const handleSelectSort = (sortId: 'popular' | 'price_asc' | 'price_desc' | 'rating') => {
    setCurrentSort(sortId);
    setIsSortModalVisible(false);

    // Lấy danh sách sản phẩm hiện tại theo từ khóa
    const baseProducts = productController.getProducts({ keyword: keyword });

    // Gọi hàm sortProduct trong productController để sắp xếp lại danh sách
    const sortedData = productController.sortProduct(productList, sortId);
    
    setProductList(sortedData);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 1. Header Top Bar */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111" />
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
          <View style={styles.rowBetween}>
            <Text style={styles.screenMainTitle}>{keyword}</Text>
            <TouchableOpacity>
              <Ionicons name="share-outline" size={24} color="#111" />
            </TouchableOpacity>
          </View>  
          <View style={styles.rowBetween}>
            <Text style={styles.totalCountText}>{`${productList.length} товаров`}</Text>
          </View>
        </View>

        {/* 3. Horizontal Filter Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {/* Sắp xếp (Sort) - Bấm vào sẽ mở Modal */}
          <TouchableOpacity 
            style={[
              styles.sortIconButton, 
              currentSort !== 'popular' && styles.filterIconButtonActive
            ]} 
            onPress={() => setIsSortModalVisible(true)}
          >
            <MaterialCommunityIcons 
              name="sort-variant" 
              size={24} 
              color={currentSort !== 'popular' ? '#fff' : 'black'} 
            />      
          </TouchableOpacity>

          {filterChips.map((chip) => {
            if (chip.type === 'filter') {
              return (
                <TouchableOpacity 
                  key={chip.id} 
                  style={styles.filterIconButtonActive}
                  onPress={() => navigation.navigate('Filter')}
                >
                  <Ionicons name="options-outline" size={20} color="#fff" />
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
          {productList.map((item: any) => (
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
      {/* Modal Sắp xếp (Bottom Sheet) */}
      <Modal
        visible={isSortModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsSortModalVisible(false)}
        >
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Сортировка</Text>
              <TouchableOpacity onPress={() => setIsSortModalVisible(false)}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.sortOptionItem}
                onPress={() => handleSelectSort(option.id as any)}
              >
                <Text style={[
                  styles.sortOptionText, 
                  currentSort === option.id && styles.sortOptionTextActive
                ]}>
                  {option.label}
                </Text>
                {currentSort === option.id && (
                  <Ionicons name="checkmark" size={22} color="#005bff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  screenMainTitle: { fontSize: 26, fontWeight: '600', color: '#111', marginBottom: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalCountText: { fontSize: 15, color: '#8e8e93' },

  filterScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  sortIconButton: { width: 40, height: 30, borderRadius: 20, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  filterIconButtonActive: { width: 40, height: 30, backgroundColor: '#005bff', borderRadius: 16, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  filterBadge: { position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: '#ff3b30', justifyContent: 'center', alignItems: 'center' },
  filterBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  filterChipItem: { height: 30, backgroundColor: '#f6f6f8', borderRadius: 16, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
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

  // Styles cho Modal Bottom Sheet sắp xếp
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    height:'50%'
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111',
  },
  closeModalText: {
    fontSize: 18,
    color: '#8e8e93',
    padding: 4,
  },
  sortOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    
  },
  sortOptionText: {
    fontSize: 18,
    color: '#333',
  },
  sortOptionTextActive: {
    color: '#005bff',
    fontWeight: 'bold',
  },
});