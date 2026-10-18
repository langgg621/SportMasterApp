import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { productController } from '../controllers/productController';
import { categoryController } from '../controllers/catelogyController';
import { Product } from '../models/product';
import { Ionicons } from '@expo/vector-icons';
import FloatingNavBar from '../components/FloatingNavBar';

export default function SearchScreen({ navigation }: { navigation: any }) {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);

  // Lấy danh sách danh mục từ controller để hiển thị gợi ý nhanh
  const categoriesList = categoryController.getAllCategories();

  const handleTextChange = (text: string) => {
    setKeyword(text);
    setSelectedCategoryName(null);
    setHasSearched(false);
    
    if (text.trim() === '') {
      setSuggestions([]);
      setSearchResults([]);
    } else {
      // Gợi ý từ khóa sản phẩm hoặc tên danh mục
      const allCategories = categoriesList.map(c => c.name);
      const matchedCats = allCategories.filter(c => c.toLowerCase().includes(text.toLowerCase()));
      
      const productSuggestions = productController.getSearchSuggestions(text);
      setSuggestions(Array.from(new Set([...matchedCats, ...productSuggestions])).slice(0, 4));

      // Mặc định tìm kiếm sản phẩm theo từ khóa
      const results = productController.getProducts({ keyword: text });
      setSearchResults(results);
    }
  };

  // Khi nhấn tìm kiếm (Enter)
  const handleSubmitEditing = () => {
    if (keyword.trim() !== '') {
      setHasSearched(true);
      setSuggestions([]);

      // Ưu tiên kiểm tra xem từ khóa nhập vào có trùng với tên danh mục nào không
      const categoryProducts = categoryController.getProductsByCategoryName(keyword);
      if (categoryProducts.length > 0) {
        setSelectedCategoryName(keyword);
        setSearchResults(categoryProducts);
      } else {
        const results = productController.getProducts({ keyword });
        setSearchResults(results);
      }
    }
  };

  // Khi người dùng bấm trực tiếp vào thẻ danh mục ngang
  const handleSelectCategory = (categoryName: string) => {
    setKeyword(categoryName);
    setSelectedCategoryName(categoryName);
    setHasSearched(true);
    setSuggestions([]);

    const results = categoryController.getProductsByCategoryName(categoryName);
    setSearchResults(results);
  };

  // Tính tổng số lượng giỏ hàng cho FloatingNavBar
  const cartState = categoryController.getAllCategories(); // Hoặc cartController
  const totalCartCount = 0; // Bạn có thể tích hợp cartController.getCartState() ở đây

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={18} color="#8e8e93" style={{ marginRight: 6 }} />
          <TextInput
            style={styles.input}
            value={keyword}
            onChangeText={handleTextChange}
            onSubmitEditing={handleSubmitEditing}
            placeholder="Поиск по категориям и товарам..."
            placeholderTextColor="#8e8e93"
            autoFocus
            returnKeyType="search"
          />
          {keyword.length > 0 && (
            <TouchableOpacity onPress={() => handleTextChange('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Thanh danh mục cuộn ngang */}
      {!hasSearched && (
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Категории</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {categoriesList.map((cat) => (
              <TouchableOpacity 
                key={cat.id} 
                style={[
                  styles.categoryCard, 
                  selectedCategoryName === cat.name && styles.categoryCardActive
                ]}
                onPress={() => handleSelectCategory(cat.name)}
              >
                <Ionicons 
                  name={(cat.icon as any) || 'grid-outline'} 
                  size={20} 
                  color={selectedCategoryName === cat.name ? '#fff' : '#005bff'} 
                  style={{ marginBottom: 4 }} 
                />
                <Text style={[
                  styles.categoryCardText,
                  selectedCategoryName === cat.name && styles.categoryCardTextActive
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Gợi ý từ khóa */}
      {!hasSearched && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                setKeyword(item);
                handleSubmitEditing();
              }}
            >
              <Ionicons name="search-outline" size={16} color="#888" style={{ marginRight: 12 }} />
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Kết quả tìm kiếm */}
      {hasSearched && searchResults.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Text style={styles.foundText}>Нашли 0 товаров</Text>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Ничего не найдено</Text>
            <Text style={styles.emptySubText}>Попробуйте изменить запрос или выбрать другую категорию</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          ListHeaderComponent={
            hasSearched && searchResults.length > 0 ? (
              <Text style={styles.resultTitle}>
                {selectedCategoryName ? `Категория: ${selectedCategoryName}` : `Результаты поиска`} ({searchResults.length} товаров)
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            >
              <Image source={{ uri: item.images[0] }} style={styles.productImg} />
              {item.discount && (
                <View style={styles.badge}><Text style={styles.badgeText}>{item.discount}</Text></View>
              )}
              <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.price}>{item.price} ₽</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  searchInputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f2f6', borderRadius: 20, paddingHorizontal: 12, height: 40 },
  input: { flex: 1, fontSize: 15, color: '#333' },
  clearIcon: { fontSize: 14, color: '#666', padding: 4 },
  categorySection: { paddingHorizontal: 12, marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111', marginBottom: 8 },
  categoryScroll: { paddingBottom: 6, gap: 10 },
  categoryCard: {
    backgroundColor: '#f6f6f8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    minWidth: 90,
  },
  categoryCardActive: { backgroundColor: '#005bff', borderColor: '#005bff' },
  categoryCardText: { fontSize: 13, fontWeight: '600', color: '#333' },
  categoryCardTextActive: { color: '#fff' },
  suggestionsContainer: { borderBottomWidth: 1, borderColor: '#eee', marginBottom: 10 },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  suggestionText: { fontSize: 15, color: '#222' },
  productList: { padding: 8 },
  productCard: { width: '48%', backgroundColor: '#fff', margin: '1%', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  productImg: { width: '100%', height: 140, resizeMode: 'cover', borderRadius: 6 },
  badge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#ff3b30', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  productName: { fontSize: 13, color: '#333', marginTop: 6 },
  price: { fontSize: 15, fontWeight: 'bold', color: '#005bff', marginTop: 4 },
  resultTitle: { fontSize: 15, fontWeight: 'bold', marginHorizontal: 8, marginVertical: 8, color: '#111', width: '100%' },
  emptyWrapper: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  foundText: { fontSize: 15, color: '#444', fontWeight: '500' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 150 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 8 },
  emptySubText: { fontSize: 14, color: '#8e8e93', textAlign: 'center' },
});