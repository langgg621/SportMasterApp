import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { productController } from '../controllers/productController';

export default function FilterScreen({ route, navigation }: { route: any; navigation: any }) {
  // 1. Nhận danh sách sản phẩm hiện tại từ màn hình SearchResult truyền sang (nếu chưa có thì lấy toàn bộ)
  const initialResults = route?.params?.currentResults || productController.getProducts();

  // Tính giá min/max dựa trên chính danh sách tìm kiếm hiện tại
  const computedMinPrice = initialResults.length > 0 ? Math.min(...initialResults.map((p: any) => p.price)).toString() : '0';
  const computedMaxPrice = initialResults.length > 0 ? Math.max(...initialResults.map((p: any) => p.price)).toString() : '100000';

  // States lọc
  const [deliveryChecked, setDeliveryChecked] = useState(false);
  const [minPrice, setMinPrice] = useState(computedMinPrice);
  const [maxPrice, setMaxPrice] = useState(computedMaxPrice);
  
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);

  const [checkboxes, setCheckboxes] = useState({
    discount: false,
    bestPrice: false,
    newCollection: false,
    newBrands: false,
  });

  const toggleCheckbox = (key: keyof typeof checkboxes) => {
    setCheckboxes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleChip = (item: string, list: string[], setList: (val: string[]) => void) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  // 2. Lọc cơ sở theo khoảng giá từ danh sách tìm kiếm ban đầu
  const baseProducts = initialResults.filter((p: any) => {
    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Infinity;
    return p.price >= min && p.price <= max;
  });

  // Lấy các tùy chọn động thông qua Controller dựa trên tập kết quả tìm kiếm
  const baseOptions = productController.getFilterOptions(baseProducts);

  // 3. Tính tổng số sản phẩm cuối cùng khớp mọi bộ lọc để hiển thị lên nút bấm dưới đáy
  const finalFilteredProducts = productController.getProducts({
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    brandIds: selectedBrands.length > 0 ? selectedBrands : undefined,
    colors: selectedColors.length > 0 ? selectedColors : undefined,
    sports: selectedSports.length > 0 ? selectedSports : undefined,
    seasons: selectedSeasons.length > 0 ? selectedSeasons : undefined,
    isHotDeal: checkboxes.discount || checkboxes.bestPrice ? true : undefined,
    isNew: checkboxes.newCollection ? true : undefined,
  });

  const handleApply = () => {
    navigation.navigate('SearchResult', {
      results: finalFilteredProducts,
      appliedFilterCount: selectedBrands.length + selectedProductTypes.length + selectedSizes.length + selectedSports.length,
    });
  };

  const FilterSection = ({ 
    title, 
    data, 
    selectedList, 
    onSelect, 
    showAllLink = true 
  }: { 
    title: string; 
    data: string[]; 
    selectedList: string[]; 
    onSelect: (item: string) => void;
    showAllLink?: boolean;
  }) => {
    if (!data || data.length === 0) return null;
    return (
      <View style={styles.sectionPadding}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {showAllLink && <TouchableOpacity><Text style={styles.allLink}>Все</Text></TouchableOpacity>}
        </View>
        <View style={styles.chipWrapContainer}>
          {data.map(item => {
            const active = selectedList.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => onSelect(item)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                {active && <Ionicons name="close" size={14} color="#005bff" style={{ marginLeft: 4 }} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderCheckboxRow = (label: string, key: keyof typeof checkboxes) => {
    const isChecked = checkboxes[key];
    return (
      <TouchableOpacity 
        style={styles.checkboxRow} 
        key={key} 
        activeOpacity={0.8}
        onPress={() => toggleCheckbox(key)}
      >
        <Text style={styles.checkboxLabel}>{label}</Text>
        <View style={[styles.squareCheckbox, isChecked && styles.squareCheckboxActive]}>
          {isChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
      </TouchableOpacity>
    );
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
          setSelectedBrands([]); setSelectedProductTypes([]); setSelectedSizes([]); setSelectedSports([]);
          setMinPrice(computedMinPrice); setMaxPrice(computedMaxPrice);
        }}>
          <Text style={styles.resetText}>Сбросить</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Доставка */}
        <TouchableOpacity style={styles.listItemRow} activeOpacity={0.8} onPress={() => setDeliveryChecked(!deliveryChecked)}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.listItemLabel}>Доставка</Text>
            <Text style={styles.listItemSub}>Томск, Буяновский переулок, 3А</Text>
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

        {/* Вид товара */}
        <FilterSection title="Вид товара" data={baseOptions.productTypes} selectedList={selectedProductTypes} onSelect={(item) => toggleChip(item, selectedProductTypes, setSelectedProductTypes)} />

        <View style={styles.sectionDivider} />

        {/* Размер */}
        {baseOptions.sizes.length > 0 && (
          <>
            <View style={styles.sectionPadding}>
              <View style={styles.rowBetween}>
                <Text style={styles.sectionTitle}>Размер</Text>
                <TouchableOpacity><Text style={styles.allLink}>Все</Text></TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {baseOptions.sizes.map(item => {
                  const active = selectedSizes.includes(item);
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[styles.sizeChip, active && styles.sizeChipActive]}
                      onPress={() => toggleChip(item, selectedSizes, setSelectedSizes)}
                    >
                      <Text style={[styles.sizeChipText, active && styles.sizeChipTextActive]}>{item}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
            <View style={styles.sectionDivider} />
          </>
        )}

        {/* Các danh mục động lấy từ danh sách tìm kiếm */}
        <FilterSection title="Бренд" data={baseOptions.brands} selectedList={selectedBrands} onSelect={(item) => toggleChip(item, selectedBrands, setSelectedBrands)} />
        {renderCheckboxRow('Новые бренды', 'newBrands')}
        <View style={styles.sectionDivider} />

        <FilterSection title="Вид спорта" data={baseOptions.sports} selectedList={selectedSports} onSelect={(item) => toggleChip(item, selectedSports, setSelectedSports)} />
        <View style={styles.sectionDivider} />

        <FilterSection title="Цвет" data={baseOptions.colors} selectedList={selectedColors} onSelect={(item) => toggleChip(item, selectedColors, setSelectedColors)} />
        <View style={styles.sectionDivider} />

        <FilterSection title="Сезон" data={baseOptions.seasons} selectedList={selectedSeasons} showAllLink={false} onSelect={(item) => toggleChip(item, selectedSeasons, setSelectedSeasons)} />
        <View style={styles.sectionDivider} />

        {renderCheckboxRow('Товары со скидкой', 'discount')}
        {renderCheckboxRow('Лучшая цена', 'bestPrice')}
        {renderCheckboxRow('Новая коллекция', 'newCollection')}

      </ScrollView>

      {/* Nút kết quả dưới đáy */}
      <View style={styles.bottomBarContainer}>
        <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85} onPress={handleApply}>
          <Text style={styles.submitBtnText}>{`Показать ${finalFilteredProducts.length} товаров`}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f0f0f0',
  },
  closeBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  resetText: { fontSize: 15, color: '#005bff', fontWeight: '500' },
  listItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  listItemLabel: { fontSize: 16, fontWeight: '600', color: '#111' },
  listItemSub: { fontSize: 13, color: '#005bff', marginTop: 2 },
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
  checkboxRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  checkboxLabel: { fontSize: 16, fontWeight: '500', color: '#111' },
  squareCheckbox: {
    width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#d1d1d6',
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff',
  },
  squareCheckboxActive: { backgroundColor: '#005bff', borderColor: '#005bff' },
  chipWrapContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f6f6f8', paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: '#eee', marginBottom: 4,
  },
  chipActive: { backgroundColor: '#eef3ff', borderColor: '#005bff' },
  chipText: { fontSize: 14, color: '#333' },
  chipTextActive: { color: '#005bff', fontWeight: 'bold' },
  sizeChip: { width: 48, height: 44, backgroundColor: '#f6f6f8', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  sizeChipActive: { backgroundColor: '#eef3ff', borderColor: '#005bff' },
  sizeChipText: { fontSize: 15, fontWeight: '600', color: '#111' },
  sizeChipTextActive: { color: '#005bff' },
  bottomBarContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, borderTopWidth: 1, borderColor: '#eee',
  },
  submitBtn: {
    backgroundColor: '#005bff', borderRadius: 12, height: 52, justifyContent: 'center', alignItems: 'center',
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});