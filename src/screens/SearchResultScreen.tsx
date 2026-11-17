import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { useCart } from '../hooks/useCart';
import { useFloatingNav } from '../hooks/useFloatingNav';
import { productController } from '../controllers/productController';
import {systemKeyController} from '../controllers/systemKeyController'; // Import API Lấy Chip
import { Product } from '../models';
import { SystemKey } from '../models/systemKey';
import FloatingNavBar from '../components/FloatingNavBar';
import { ProductCard } from '../components/ProductCard';

export default function SearchResultScreen({ route, navigation }: { route: any; navigation: any }) {  
  const keyword = route?.params?.keyword || '';
  // Lấy các filter được truyền từ FilterScreen sang
  const passedFilters = useMemo(
  () => route?.params?.filters || {},
  [route?.params?.filters]
);

  const { addToCart } = useCart();
  const floatingNav = useFloatingNav(navigation);
  
  const [currentSort, setCurrentSort] = useState('newest');
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  // State cho Sort và Chip (Lấy từ API)
  const [sortOptions, setSortOptions] = useState<SystemKey[]>([]);
  const [filterChips, setFilterChips] = useState<SystemKey[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Lấy danh sách Sort và Chip từ DB
  useEffect(() => {
    const fetchSystemKeys = async () => {
      try {
        const [sorts, filters] = await Promise.all([
          systemKeyController.getByParentID(90),  // SORT_TYPE
          systemKeyController.getByParentID(100)  // QUICK_FILTER
        ]);
        setSortOptions(sorts || []);
        setFilterChips(filters || []);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu Sort/Filter:', error);
      }
    };

    fetchSystemKeys();
  }, []);

  // Hàm gọi API lấy sản phẩm
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams: any = {
        keyword,
        sortBy: currentSort,
        ...passedFilters // Gộp các bộ lọc từ FilterScreen
      };

      // Xử lý logic lọc cho Chip (nếu có)
      if (activeFilter === 'FILTER_PRICE') queryParams.maxPrice = 5000; 
      // Thêm các logic lọc khác cho Chip tại đây

      const queryString = new URLSearchParams(queryParams as any).toString();
      const res = await productController.getAll(queryString);
      setProductList(res.items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi lại API khi Sort, Filter truyền sang, hoặc Chip thay đổi
  useEffect(() => {
    fetchProducts();
  }, [keyword, currentSort, passedFilters, activeFilter]);

  const handleSelectSort = (sortId: string) => {
    setCurrentSort(sortId);
    setIsSortModalVisible(false);
  };

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
      {/* Header Top Bar */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.searchBarBox} onPress={() => navigation.goBack()}>
          <Ionicons name="search-outline" size={16} color="#8e8e93" style={{ marginRight: 6 }} />
          <Text style={styles.searchText} numberOfLines={1}>{keyword || 'Поиск'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chatIconBtn}>
          <Ionicons name="share-outline" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Title & Count */}
        <View style={styles.titleSection}>
          <View style={styles.rowBetween}>
            <Text style={styles.screenMainTitle}>{keyword || 'Результаты'}</Text>
          </View>  
          <View style={styles.rowBetween}>
            <Text style={styles.totalCountText}>{`${productList.length} товаров`}</Text>
          </View>
        </View>

        {/* Filter Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {/* Nút Sort */}
          <TouchableOpacity 
            style={[styles.iconButton, currentSort !== 'newest' && styles.iconButtonActive]} 
            onPress={() => setIsSortModalVisible(true)}
          >
            <MaterialCommunityIcons name="sort-variant" size={24} color={currentSort !== 'newest' ? '#fff' : '#111'} />      
          </TouchableOpacity>

          {/* Nút Mở Màn Hình Lọc */}
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Filter', { keyword, currentResults: productList })}
          >
            <Ionicons name="options-outline" size={20} color="#111" />
          </TouchableOpacity>

          {/* Render Chip từ API */}
          {filterChips.map((chip) => {
            const isActive = activeFilter === chip.codeValue;
            return (
              <TouchableOpacity 
                key={chip.id} 
                style={[styles.filterChipItem, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(isActive ? null : chip.codeValue)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {chip.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Product Grid List */}
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.productGrid}>
            {productList.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                onAddToCart={() => handleQuickAdd(item)}
              />
            ))}
            {productList.length === 0 && (
              <Text style={{ textAlign: 'center', width: '100%', marginTop: 40, color: '#888' }}>Ничего не найдено</Text>
            )}
          </View>
        )}
      </ScrollView>

      <FloatingNavBar activeTab="Каталог" {...floatingNav} />

      {/* Modal Sắp xếp */}
      <Modal visible={isSortModalVisible} transparent animationType="slide" onRequestClose={() => setIsSortModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsSortModalVisible(false)}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Сортировка</Text>
              <TouchableOpacity onPress={() => setIsSortModalVisible(false)}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            {sortOptions.map((option) => (
              <TouchableOpacity key={option.id} style={styles.sortOptionItem} onPress={() => handleSelectSort(option.codeValue)}>
                <Text style={[styles.sortOptionText, currentSort === option.codeValue && styles.sortOptionTextActive]}>
                  {option.description}
                </Text>
                {currentSort === option.codeValue && <Ionicons name="checkmark" size={22} color="#005bff" />}
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

  titleSection: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  screenMainTitle: { fontSize: 26, fontWeight: '600', color: '#111', marginBottom: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalCountText: { fontSize: 15, color: '#8e8e93' },

  filterScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8, alignItems: 'center' },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 4 },
  iconButtonActive: { backgroundColor: '#005bff' },
  filterChipItem: { height: 40, backgroundColor: '#f6f6f8', borderRadius: 20, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  filterChipText: { fontSize: 14, fontWeight: '500', color: '#333' },
  filterChipActive: { backgroundColor: '#eef3ff', borderColor: '#005bff' },
  filterChipTextActive: { color: '#005bff', fontWeight: 'bold' },

  productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, justifyContent: 'space-between', marginTop: 8, gap: 12 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  bottomSheetContainer: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, height: '40%' },
  bottomSheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  bottomSheetTitle: { fontSize: 24, fontWeight: '600', color: '#111' },
  closeModalText: { fontSize: 18, color: '#8e8e93', padding: 4 },
  sortOptionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  sortOptionText: { fontSize: 18, color: '#333' },
  sortOptionTextActive: { color: '#005bff', fontWeight: 'bold' },
});