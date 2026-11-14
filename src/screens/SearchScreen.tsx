import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { productController } from '../controllers/productController';
import { catalogController } from '../controllers/catalogController';
import { Category } from '../models';

export default function SearchScreen({ navigation }: { navigation: any }) {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Lưu danh sách danh mục lấy từ API
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);

  // Gọi API lấy danh mục khi màn hình vừa mở
  useEffect(() => {
    catalogController.getCategories()
      .then(data => setCategoriesList(data || []))
      .catch(console.error);
  }, []);

  const handleTextChange = (text: string) => {
    setKeyword(text);
    setHasSearched(false);
    
    if (text.trim() === '') {
      setSuggestions([]);
    } else {
      // Gợi ý dựa trên tên danh mục
      const matchedCats = categoriesList
        .map(c => c.name)
        .filter(c => c.toLowerCase().includes(text.toLowerCase()));
      
      setSuggestions(Array.from(new Set(matchedCats)).slice(0, 5));
    }
  };

  const executeSearch = async (searchKey: string) => {
    if (!searchKey.trim()) return;

    setLoading(true);
    setSuggestions([]);

    try {
      // Gọi API thật: Tìm kiếm theo từ khóa
      const res = await productController.getAll(`keyword=${searchKey}`);
      
      setHasSearched(true);

      // Nếu tìm thấy sản phẩm -> Chuyển sang màn hình Kết quả SearchResult
      if (res.items && res.items.length > 0) {
        navigation.navigate('SearchResult', { keyword: searchKey, results: res.items });
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEditing = () => {
    executeSearch(keyword);
  };

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
            placeholder="Искать в Спортмастере"
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

      {/* Trạng thái đang tải */}
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {/* Danh mục ngang khi chưa tìm kiếm */}
      {!hasSearched && !loading && (
        <View style={styles.suggestionsContainer}>
          {categoriesList.slice(0, 5).map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.suggestionItem}
              activeOpacity={0.7}
              onPress={() => handleSelectSuggestionOrCategory(cat.name)}
            >
              <Ionicons name="search-outline" size={20} color="#8e8e93" />
              <Text style={styles.suggestionText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Gợi ý từ khóa */}
      {!hasSearched && !loading && suggestions.length > 0 && (
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
      {hasSearched && !loading && (
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
  suggestionsContainer: { marginTop: 10 },
  suggestionItem: { marginHorizontal: 20, flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  suggestionText: { fontSize: 18, color: '#222', marginLeft: 10 },
  emptyWrapper: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  foundText: { fontSize: 16, color: '#444', fontWeight: '400', marginTop: 10 },
  imageContainer: { alignItems: 'center', marginTop: 50 },
  emptyImage: { width: 300, height: 300 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
  emptyTitle: { fontSize: 24, fontWeight: '600', color: '#111', marginVertical: 20 },
  emptySubText: { fontSize: 18, color: '#8e8e93', textAlign: 'center' },
});