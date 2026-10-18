import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { productController } from '../controllers/productController';
import { Product } from '../models/product';
import { Ionicons } from '@expo/vector-icons';
import FloatingNavBar from '../components/FloatingNavBar';

export default function SearchScreen({ navigation }: { navigation: any }) {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTextChange = (text: string) => {
    setKeyword(text);
    setHasSearched(false);
    
    if (text.trim() === '') {
      setSuggestions([]);
      setSearchResults([]);
    } else {
      const allProducts = productController.getProducts({});
      const matchedNames = allProducts
        .map((p) => p.name)
        .filter((name) => name.toLowerCase().includes(text.toLowerCase()));
      const uniqueSuggestions = Array.from(new Set(matchedNames)).slice(0, 4);
      setSuggestions(uniqueSuggestions);

      const results = productController.getProducts({ keyword: text });
      setSearchResults(results);
    }
  };

  const handleSubmitEditing = () => {
    if (keyword.trim() !== '') {
      setHasSearched(true);
      const results = productController.getProducts({ keyword });
      setSearchResults(results);
      setSuggestions([]);
    }
  };

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
            placeholder="Поиск в Спортмастере..."
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
        <TouchableOpacity style={styles.chatBtn}>
          <Ionicons name="chatbubble-outline" size={22} color="#111" />
          <View style={styles.chatBadge}><Text style={styles.chatBadgeText}>1</Text></View>
        </TouchableOpacity>
      </View>

      {/* Quick Filter Chips */}
      {!hasSearched && (
        <View style={styles.filterChipsRow}>
          {['мужская', 'женская', 'детская', 'для мальчика'].map((chip) => (
            <TouchableOpacity 
              key={chip} 
              style={styles.filterChip}
              onPress={() => {
                setKeyword(chip);
                handleTextChange(chip);
                setHasSearched(true);
                setSearchResults(productController.getProducts({ keyword: chip }));
                setSuggestions([]);
              }}
            >
              <Text style={styles.filterChipText}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Gợi ý từ khóa khi đang gõ */}
      {!hasSearched && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                setKeyword(item);
                handleTextChange(item);
                setHasSearched(true);
                setSearchResults(productController.getProducts({ keyword: item }));
                setSuggestions([]);
              }}
            >
              <Ionicons name="search-outline" size={16} color="#888" style={{ marginRight: 12 }} />
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Trạng thái: Không tìm thấy kết quả */}
      {hasSearched && searchResults.length === 0 ? (
        <View style={styles.emptyWrapper}>
          {/* Dòng chữ "Нашли 0 товаров" đặt ngay sát dưới phần tìm kiếm */}
          <Text style={styles.foundText}>Нашли 0 товаров</Text>

          {/* Phần nội dung hình ảnh và thông báo được đẩy ra giữa màn hình và phóng to */}
          <View style={styles.emptyContainer}>
            <View style={styles.illustrationContainer}>
              <Image 
                source={require('../constants/search_image.png')} 
                style={styles.notFoundImage} 
                resizeMode="contain" 
              />
            </View>
            <Text style={styles.emptyTitle}>Ничего не найдено</Text>
            <Text style={styles.emptySubText}>
              Попробуйте изменить ваш запрос или воспользуйтесь каталогом
            </Text>
          </View>
        </View>
      ) : (
        /* Danh sách sản phẩm kết quả */
        <FlatList
          key="product-search-grid"
          data={searchResults}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          ListHeaderComponent={
            hasSearched && searchResults.length > 0 ? (
              <Text style={styles.resultTitle}>Нашли {searchResults.length} товаров</Text>
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
  searchInputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f2f6', borderRadius: 20, paddingHorizontal: 12, height: 40, marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: '#333' },
  clearIcon: { fontSize: 14, color: '#666', padding: 4 },
  chatBtn: { position: 'relative', padding: 6, justifyContent: 'center', alignItems: 'center' },
  chatBadge: { position: 'absolute', right: 2, top: 2, width: 16, height: 16, borderRadius: 8, backgroundColor: '#f3203d', justifyContent: 'center', alignItems: 'center' },
  chatBadgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
  filterChipsRow: { flexDirection: 'row', padding: 10, backgroundColor: '#fafafa' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#ddd', marginRight: 8 },
  filterChipText: { fontSize: 13, color: '#333' },
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

  // Tinh chỉnh bố cục không tìm thấy kết quả
  emptyWrapper: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  foundText: { fontSize: 15, color: '#444', fontWeight: '500' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 200 },
  illustrationContainer: { marginVertical: 24, alignItems: 'center', justifyContent: 'center' },
  notFoundImage: { width: 240, height: 200 }, // Phóng to kích thước ảnh minh họa
  emptyTitle: { fontSize: 24, fontWeight: 'bold', color: '#111', marginBottom: 10, textAlign: 'center' },
  emptySubText: { fontSize: 15, color: '#8e8e93', textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
});