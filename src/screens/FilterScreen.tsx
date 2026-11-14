import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { productController } from '../controllers/productController';
import { catalogController } from '../controllers/catalogController';
import { Brand } from '../models';

// --- TÁCH COMPONENT CON ĐỂ CODE GỌN HƠN ---
const FilterSection = ({ title, data, selectedList, onSelect }: any) => {
  if (!data || data.length === 0) return null;
  return (
    <View style={styles.sectionPadding}>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity><Text style={styles.allLink}>Все</Text></TouchableOpacity>
      </View>
      <View style={styles.chipWrapContainer}>
        {data.map((item: any) => {
          const active = selectedList.includes(item.id || item.name);
          const value = item.id || item.name; // Dùng ID nếu có, không thì dùng Tên
          return (
            <TouchableOpacity
              key={value}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onSelect(value)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.name}</Text>
              {active && <Ionicons name="close" size={14} color="#005bff" style={{ marginLeft: 4 }} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const CheckboxRow = ({ label, isChecked, onPress }: any) => (
  <TouchableOpacity style={styles.checkboxRow} activeOpacity={0.8} onPress={onPress}>
    <Text style={styles.checkboxLabel}>{label}</Text>
    <View style={[styles.squareCheckbox, isChecked && styles.squareCheckboxActive]}>
      {isChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
    </View>
  </TouchableOpacity>
);

// --- MÀN HÌNH CHÍNH ---
export default function FilterScreen({ route, navigation }: { route: any; navigation: any }) {
  // Nhận từ khóa (nếu đi từ màn Search sang) và danh sách sản phẩm hiện tại
  const keyword = route?.params?.keyword || '';
  const initialResults = route?.params?.currentResults || [];
  
  // Tính giá min/max dựa trên kết quả hiện tại
  const computedMinPrice = initialResults.length > 0 ? Math.min(...initialResults.map((p: any) => p.newPrice)).toString() : '0';
  const computedMaxPrice = initialResults.length > 0 ? Math.max(...initialResults.map((p: any) => p.newPrice)).toString() : '100000';

  const [loading, setLoading] = useState(false);
  const [brandsData, setBrandsData] = useState<Brand[]>([]);
  
  // States lọc
  const [deliveryChecked, setDeliveryChecked] = useState(false);
  const [minPrice, setMinPrice] = useState(computedMinPrice);
  const [maxPrice, setMaxPrice] = useState(computedMaxPrice);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
  const [checkboxes, setCheckboxes] = useState({
    onlySale: false,
    bestPrice: false,
    newCollection: false,
  });

  // Gọi API lấy danh sách Thương hiệu thật từ DB
  useEffect(() => {
    catalogController.getBrands().then(setBrandsData).catch(console.error);
  }, []);

  const toggleChip = (item: string, list: string[], setList: (val: string[]) => void) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const toggleCheckbox = (key: keyof typeof checkboxes) => {
    setCheckboxes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Gọi API Áp dụng bộ lọc và chuyển sang trang Kết quả
  // Gọi API Áp dụng bộ lọc và chuyển sang trang Kết quả
  const handleApply = async () => {
    setLoading(true);
    try {
      // 1. Tạo Object chứa các bộ lọc
      const filters: any = {};
      if (keyword) filters.keyword = keyword;
      if (minPrice) filters.minPrice = Number(minPrice);
      if (maxPrice) filters.maxPrice = Number(maxPrice);
      if (selectedBrands.length > 0) filters.brandIds = selectedBrands.join(',');
      if (checkboxes.onlySale) filters.onlySale = 1;

      // 2. Chuyển Object thành chuỗi Query String (vd: "keyword=áo&minPrice=100")
      const queryString = new URLSearchParams(filters).toString();
      
      // 3. Gọi hàm getAll (đã có sẵn trong Controller)
      const res = await productController.getAll(queryString);
      
      navigation.navigate('SearchResult', {
        keyword: keyword,
        results: res.items, // Backend trả về { items, total, ... }
        appliedFilterCount: selectedBrands.length + (checkboxes.onlySale ? 1 : 0),
      });
    } catch (error) {
      console.error(error);
      alert('Ошибка при фильтрации');
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close-outline" size={28} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Фильтр</Text>
        <TouchableOpacity onPress={() => {
          setSelectedBrands([]);
          setCheckboxes({ onlySale: false, bestPrice: false, newCollection: false });
          setMinPrice(computedMinPrice); setMaxPrice(computedMaxPrice);
        }}>
          <Text style={styles.resetText}>Сбросить</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Доставка (Giữ nguyên UI) */}
        <TouchableOpacity style={styles.listItemRow} activeOpacity={0.8} onPress={() => setDeliveryChecked(!deliveryChecked)}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.listItemLabel}>Доставка</Text>
          </View>
          <View style={[styles.squareCheckbox, deliveryChecked && styles.squareCheckboxActive]}>
            {deliveryChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
        </TouchableOpacity>

        <View style={styles.sectionDivider} />

        {/* Цена */}
        <View style={styles.sectionPadding}>
          <Text style={styles.sectionTitle}>Цена</Text>
          <View style={styles.priceInputRow}>
            <View style={styles.priceBox}>
              <Text style={styles.priceSubLabel}>От</Text>
              <TextInput style={styles.priceTextInput} value={minPrice} onChangeText={setMinPrice} keyboardType="numeric" />
            </View>
            <View style={styles.priceDash} />
            <View style={styles.priceBox}>
              <Text style={styles.priceSubLabel}>До</Text>
              <TextInput style={styles.priceTextInput} value={maxPrice} onChangeText={setMaxPrice} keyboardType="numeric" />
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Бренд (Lấy từ API thật) */}
        <FilterSection 
          title="Бренд" 
          data={brandsData} 
          selectedList={selectedBrands} 
          onSelect={(id: string) => toggleChip(id, selectedBrands, setSelectedBrands)} 
        />
        <View style={styles.sectionDivider} />

        {/* Các Checkbox lọc */}
        <CheckboxRow 
          label="Товары со скидкой" 
          isChecked={checkboxes.onlySale} 
          onPress={() => toggleCheckbox('onlySale')} 
        />
        <CheckboxRow 
          label="Лучшая цена" 
          isChecked={checkboxes.bestPrice} 
          onPress={() => toggleCheckbox('bestPrice')} 
        />
        <CheckboxRow 
          label="Новая коллекция" 
          isChecked={checkboxes.newCollection} 
          onPress={() => toggleCheckbox('newCollection')} 
        />

      </ScrollView>

      {/* Nút kết quả dưới đáy */}
      <View style={styles.bottomBarContainer}>
        <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85} onPress={handleApply} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Применить фильтры</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- GIỮ NGUYÊN STYLES CỦA BẠN ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  closeBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  resetText: { fontSize: 15, color: '#005bff', fontWeight: '500' },
  listItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  listItemLabel: { fontSize: 16, fontWeight: '600', color: '#111' },
  priceInputRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  priceBox: { flex: 1, backgroundColor: '#f6f6f8', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
  priceSubLabel: { fontSize: 12, color: '#888' },
  priceTextInput: { fontSize: 16, fontWeight: 'bold', color: '#111', padding: 0, marginTop: 2 },
  priceDash: { width: 10, height: 2, backgroundColor: '#ccc' },
  sectionPadding: { paddingHorizontal: 16, paddingTop: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  allLink: { fontSize: 14, color: '#888', fontWeight: '500' },
  sectionDivider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 14 },
  checkboxRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  checkboxLabel: { fontSize: 16, fontWeight: '500', color: '#111' },
  squareCheckbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#d1d1d6', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  squareCheckboxActive: { backgroundColor: '#005bff', borderColor: '#005bff' },
  chipWrapContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f6f8', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#eee', marginBottom: 4 },
  chipActive: { backgroundColor: '#eef3ff', borderColor: '#005bff' },
  chipText: { fontSize: 14, color: '#333' },
  chipTextActive: { color: '#005bff', fontWeight: 'bold' },
  bottomBarContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, borderTopWidth: 1, borderColor: '#eee' },
  submitBtn: { backgroundColor: '#005bff', borderRadius: 12, height: 52, justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});