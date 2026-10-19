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
import { cartController } from '../controllers/cartController';
import { Product } from '../models/product';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen({ navigation }: { navigation: any }) {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [productList, setProductList] = useState<Product[]>([]);
  const categoriesList = categoryController.getAllCategories();
  const cartState = cartController.getCartState();

  const handleTextChange = (text: string) => {
    setKeyword(text);
    setSelectedCategoryName(null);
    setHasSearched(false);
    
    if (text.trim() === '') {
      setSuggestions([]);
      setSearchResults([]);
    } else {
      const allCategories = categoriesList.map(c => c.name);
      const matchedCats = allCategories.filter(c => c.toLowerCase().includes(text.toLowerCase()));
      
      const productSuggestions = productController.getSearchSuggestions(text);
      setSuggestions(Array.from(new Set([...matchedCats, ...productSuggestions])).slice(0, 4));

      const results = productController.getProducts({ keyword: text });
      setSearchResults(results);
    }
  };
const executeSearch = (searchKey: string) => {
    if (!searchKey.trim()) return;

    setHasSearched(true);
    setSuggestions([]);

    // 1. Thử lấy sản phẩm theo Danh mục trước
    let results = categoryController.getProductsByCategoryName(searchKey);

    // 2. Nếu danh mục không có sản phẩm nào, mới tìm kiếm trong toàn bộ danh sách sản phẩm theo từ khóa
    if (results.length === 0) {
      results = productController.getProducts({ keyword: searchKey });
    }

    // 3. Cập nhật danh sách kết quả tìm được
    setProductList(results);

    // Nếu tìm thấy sản phẩm -> Chuyển sang màn hình Kết quả SearchResult
    if (results.length > 0) {
      navigation.navigate('SearchResult', { keyword: searchKey, results: results });
    }
  };
  // Khi nhấn tìm kiếm (Enter) trên bàn phím
  const handleSubmitEditing = () => {
    executeSearch(keyword);
  };

  // Khi bấm vào một gợi ý hoặc danh mục
  const handleSelectSuggestionOrCategory = (itemText: string) => {
    setKeyword(itemText);
    executeSearch(itemText);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.searchHeader}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={18} color="#8e8e93" style={{ marginRight: 6 }} />
          <TextInput
            style={styles.input}
            value={keyword}
            onChangeText={handleTextChange}
            onSubmitEditing={handleSubmitEditing}
            placeholder="Искасть в Спортмастере"
            placeholderTextColor="#8e8e93"
            autoFocus
            returnKeyType="search"
          />
          <Ionicons name="barcode-outline" size={20} color="#9ca6c2" />
          {keyword.length > 0 && (
            <TouchableOpacity onPress={() => handleTextChange('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Danh mục ngang khi chưa tìm kiếm */}
      {!hasSearched && (
        <View style={styles.suggestionsContainer}>
          
          {categoriesList.slice(0, 5).map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.suggestionItem}
              activeOpacity={0.7}
              onPress={() => handleSelectSuggestionOrCategory(cat.name)}
            >
              <Ionicons name="search-outline" size={20} color="#8e8e93"  />
              <Text style={styles.suggestionText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Gợi ý từ khóa */}
      {!hasSearched && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.suggestionItem}
              onPress={() => handleSelectSuggestionOrCategory(item)}
            >
              <Ionicons name="search-outline" size={16} color="#888" style={{ marginRight: 12 }} />
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Giao diện khi tìm kiếm KHÔNG CÓ KẾT QUẢ (hiện ảnh cái bơm) */}
      {hasSearched && productList.length === 0 && (
        <View style={styles.emptyWrapper}>
          <Text style={styles.foundText}>Нашли 0 товаров</Text>
          <View style={styles.imageContainer}>
            <Image 
              source={require('../constants/search_image.png')} 
              style={styles.emptyImage} 
              resizeMode="contain" 
            />
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Ничего не найдено</Text>
            <Text style={styles.emptySubText}>Попробуйте изменить ваш запрос или воспользуйтесь каталогом</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  searchInputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f2f6', borderRadius: 20, paddingHorizontal: 12, height: 40 },
  input: { flex: 1, fontSize: 18, color: '#333' },
  clearIcon: { fontSize: 14, color: '#666', padding: 4 },
  cancelBtn: { marginLeft: 10, paddingVertical: 6 },
  cancelText: { fontSize: 16, color: '#111', fontWeight: '400' },
  categorySection: { paddingHorizontal: 12, marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111', marginBottom: 8 },
  categoryScroll: { paddingBottom: 6, gap: 10 },
  categoryCard: { backgroundColor: '#f6f6f8', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#eee', minWidth: 90 },
  categoryCardActive: { backgroundColor: '#005bff', borderColor: '#005bff' },
  categoryCardText: { fontSize: 15, fontWeight: '600', color: '#333' },
  categoryCardTextActive: { color: '#fff' },
  suggestionsContainer: {   marginTop:10 },
  suggestionItem: { borderBottomWidth: 1,borderColor: '#eee', marginHorizontal: 20,flexDirection: 'row', alignItems: 'center', paddingVertical: 10, },
  suggestionText: { fontSize: 18, color: '#222', marginLeft:10 },
  emptyWrapper: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  foundText: { fontSize: 16, color: '#444', fontWeight: '400', marginTop: 10 },
  imageContainer: { alignItems: 'center', marginTop: 50 },
  emptyImage: { width: 300, height: 300 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
  emptyTitle: { fontSize: 24, fontWeight: '600', color: '#111', marginVertical: 20 },
  emptySubText: { fontSize: 18, color: '#8e8e93', textAlign: 'center' },
});