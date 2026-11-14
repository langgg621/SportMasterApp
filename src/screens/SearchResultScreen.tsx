import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { useCart } from '../hooks/useCart';
import { useFloatingNav } from '../hooks/useFloatingNav';
import { productController } from '../controllers/productController';
import { Product } from '../models';
import FloatingNavBar from '../components/FloatingNavBar';
import { ProductCard } from '../components/ProductCard'; // Tái sử dụng Component

const SORT_OPTIONS = [
  { id: 'newest', label: 'По популярности' },
  { id: 'price_asc', label: 'По возрастанию цены' },
  { id: 'price_desc', label: 'По убыванию цены' },
  { id: 'discount_desc', label: 'По размеру скидки' },
];

export default function SearchResultScreen({ route, navigation }: { route: any; navigation: any }) {  
  const { keyword, results: initialResults } = route.params || {};
  
  const { addToCart } = useCart();
  const floatingNav = useFloatingNav(navigation);
  
  const [currentSort, setCurrentSort] = useState('newest');
  const [productList, setProductList] = useState<Product[]>(initialResults || []);
  const [loading, setLoading] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  // Lọc ngang mẫu (Chỉ hiển thị UI)
  const filterChips = [
    { id: 'f2', type: 'text', title: 'Способ получения' },
    { id: 'f3', type: 'text', title: 'Товары Спортмастер' },
    { id: 'f4', type: 'text', title: 'Цена' },
  ];

  // Gọi API sắp xếp thật từ Backend
  const handleSelectSort = async (sortId: string) => {
    setCurrentSort(sortId);
    setIsSortModalVisible(false);
    setLoading(true);

    try {
      // Gửi keyword và sortBy xuống API
      const filters = { keyword: keyword || undefined, sortBy: sortId };
      const queryString = new URLSearchParams(filters as any).toString();
      
      const res = await productController.getAll(queryString);
      setProductList(res.items);
    } catch (error) {
      console.error('Lỗi sắp xếp:', error);
    } finally {
      setLoading(false);
    }
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

        <TouchableOpacity style={styles.chatIconBtn} onPress={() => navigation.navigate('SearchScreen')}>
          <Ionicons name="chatbubble-outline" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Title & Count */}
        <View style={styles.titleSection}>
          <View style={styles.rowBetween}>
            <Text style={styles.screenMainTitle}>{keyword || 'Результаты'}</Text>
            <TouchableOpacity><Ionicons name="share-outline" size={24} color="#111" /></TouchableOpacity>
          </View>  
          <View style={styles.rowBetween}>
            <Text style={styles.totalCountText}>{`${productList.length} товаров`}</Text>
          </View>
        </View>

        {/* Filter Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.sortIconButton, currentSort !== 'newest' && styles.filterIconButtonActive]} 
            onPress={() => setIsSortModalVisible(true)}
          >
            <MaterialCommunityIcons name="sort-variant" size={24} color={currentSort !== 'newest' ? '#fff' : 'black'} />      
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sortIconButton}
            onPress={() => navigation.navigate('FilterScreen', { keyword, currentResults: productList })}
          >
            <Ionicons name="options-outline" size={20} color="black" />
          </TouchableOpacity>

          {filterChips.map((chip) => (
            <TouchableOpacity key={chip.id} style={styles.filterChipItem}>
              <Text style={styles.filterChipText}>{chip.title}</Text>
            </TouchableOpacity>
          ))}
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

      {/* Modal Sắp xếp (Bottom Sheet) */}
      <Modal visible={isSortModalVisible} transparent animationType="slide" onRequestClose={() => setIsSortModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsSortModalVisible(false)}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Сортировка</Text>
              <TouchableOpacity onPress={() => setIsSortModalVisible(false)}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity key={option.id} style={styles.sortOptionItem} onPress={() => handleSelectSort(option.id)}>
                <Text style={[styles.sortOptionText, currentSort === option.id && styles.sortOptionTextActive]}>
                  {option.label}
                </Text>
                {currentSort === option.id && <Ionicons name="checkmark" size={22} color="#005bff" />}
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

  filterScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  sortIconButton: { width: 40, height: 30, borderRadius: 20, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  filterIconButtonActive: { width: 40, height: 30, backgroundColor: '#005bff', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  filterChipItem: { height: 30, backgroundColor: '#f6f6f8', borderRadius: 16, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  filterChipText: { fontSize: 14, fontWeight: '500', color: '#333' },

  productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, justifyContent: 'space-between', marginTop: 4, gap: 12 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  bottomSheetContainer: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, height: '40%' },
  bottomSheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  bottomSheetTitle: { fontSize: 24, fontWeight: '600', color: '#111' },
  closeModalText: { fontSize: 18, color: '#8e8e93', padding: 4 },
  sortOptionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  sortOptionText: { fontSize: 18, color: '#333' },
  sortOptionTextActive: { color: '#005bff', fontWeight: 'bold' },
});