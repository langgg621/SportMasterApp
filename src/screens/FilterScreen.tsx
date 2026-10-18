import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FilterScreen({ navigation }: { navigation: any }) {
  // --- STATES BỘ LỌC ---
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Кроссовки']);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['39.5']);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);

  // Tùy chọn Checkbox
  const [discountOnly, setDiscountOnly] = useState(false);
  const [exclusiveOnly, setExclusiveOnly] = useState(false);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [newBrand, setNewBrand] = useState(false);

  // Hàm toggle chọn chip đa năng
  const toggleChip = (item: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // --- MẢNG DỮ LIỆU DỰ MẪU ---
  const productTypes = ['Кроссовки', 'Кроссовки высокие', 'Кроссовки высокие утепленные'];
  const sizes = ['34', '34.5', '35', '35.5', '36', '36.5', '37', '37.5', '38', '38.5', '39', '39.5', '40', '41', '42'];
  const brands = ['361°', 'ASICS', 'Adidas', 'Altra', "Arc'teryx", 'Athlex', 'Blackstone', 'Bmai', 'Brooks'];
  const sports = ['Баскетбол', 'Бег', 'Водный туризм', 'Волейбол', 'Падел-теннис', 'Пляж', 'Походы'];
  const colors = ['Бежевый', 'Белый', 'Бирюзовый', 'Бордовый', 'Васильковый', 'Голубой'];
  const seasons = ['Всесезонный', 'Демисезон', 'Лето', 'Зима'];
  const technologies = ['Ortholite', 'Abzorb®', 'Adiwear', 'CLOUDFOAM', 'SoftFoam+'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close-outline" size={28} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Фильтр</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Địa chỉ nhận hàng / Самовывоз */}
        <TouchableOpacity style={styles.listItemRow}>
          <View>
            <Text style={styles.listItemLabel}>Доставка</Text>
            <Text style={styles.listItemSub}>Томск, Буяновский переулок, 3А</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItemRow}>
          <Text style={styles.listItemLabel}>Самовывоз</Text>
          <Ionicons name="chevron-forward" size={18} color="#aaa" />
        </TouchableOpacity>

        <View style={styles.checkboxRow}>
          <Text style={styles.checkboxLabel}>Товары Спортмастер</Text>
          <Switch value={false} onValueChange={() => {}} trackColor={{ false: '#e0e0e0', true: '#005bff' }} />
        </View>

        <View style={styles.sectionDivider} />

        {/* Khoảng giá (Цена) */}
        <View style={styles.sectionPadding}>
          <Text style={styles.sectionTitle}>Цена</Text>
          <View style={styles.priceInputRow}>
            <View style={styles.priceBox}>
              <Text style={styles.priceSubLabel}>От</Text>
              <Text style={styles.priceValueText}>1 799 ₽</Text>
            </View>
            <View style={styles.priceDash} />
            <View style={styles.priceBox}>
              <Text style={styles.priceSubLabel}>До</Text>
              <Text style={styles.priceValueText}>110 344 ₽</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Вид товара */}
        <View style={styles.sectionPadding}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Вид товара</Text>
            <TouchableOpacity><Text style={styles.allLink}>Все</Text></TouchableOpacity>
          </View>
          <View style={styles.chipWrapContainer}>
            {productTypes.map(item => {
              const active = selectedTypes.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => toggleChip(item, selectedTypes, setSelectedTypes)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Размер */}
        <View style={styles.sectionPadding}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Размер</Text>
            <TouchableOpacity><Text style={styles.allLink}>Все</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {sizes.map(item => {
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

        {/* Бренд */}
        <View style={styles.sectionPadding}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Бренд</Text>
            <TouchableOpacity><Text style={styles.allLink}>Все</Text></TouchableOpacity>
          </View>
          <View style={styles.chipWrapContainer}>
            {brands.map(item => {
              const active = selectedBrands.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => toggleChip(item, selectedBrands, setSelectedBrands)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.checkboxRow}>
          <Text style={styles.checkboxLabel}>Новые бренды</Text>
          <Switch value={newBrand} onValueChange={setNewBrand} trackColor={{ false: '#e0e0e0', true: '#005bff' }} />
        </View>

        <View style={styles.sectionDivider} />

        {/* Вид спорта */}
        <View style={styles.sectionPadding}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Вид спорта</Text>
            <TouchableOpacity><Text style={styles.allLink}>Все</Text></TouchableOpacity>
          </View>
          <View style={styles.chipWrapContainer}>
            {sports.map(item => {
              const active = selectedSports.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => toggleChip(item, selectedSports, setSelectedSports)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Цвет */}
        <View style={styles.sectionPadding}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Цвет</Text>
            <TouchableOpacity><Text style={styles.allLink}>Все</Text></TouchableOpacity>
          </View>
          <View style={styles.chipWrapContainer}>
            {colors.map(item => {
              const active = selectedColors.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => toggleChip(item, selectedColors, setSelectedColors)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Сезон */}
        <View style={styles.sectionPadding}>
          <Text style={styles.sectionTitle}>Сезон</Text>
          <View style={styles.chipWrapContainer}>
            {seasons.map(item => {
              const active = selectedSeasons.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => toggleChip(item, selectedSeasons, setSelectedSeasons)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Nút Checkbox bổ sung */}
        <View style={styles.checkboxRow}>
          <Text style={styles.checkboxLabel}>Товары со скидкой</Text>
          <Switch value={discountOnly} onValueChange={setDiscountOnly} trackColor={{ false: '#e0e0e0', true: '#005bff' }} />
        </View>

        <View style={styles.checkboxRow}>
          <Text style={styles.checkboxLabel}>Только у нас</Text>
          <Switch value={exclusiveOnly} onValueChange={setExclusiveOnly} trackColor={{ false: '#e0e0e0', true: '#005bff' }} />
        </View>

        <View style={styles.checkboxRow}>
          <Text style={styles.checkboxLabel}>Премиум</Text>
          <Switch value={premiumOnly} onValueChange={setPremiumOnly} trackColor={{ false: '#e0e0e0', true: '#005bff' }} />
        </View>

        <View style={styles.sectionDivider} />

        {/* Технологии */}
        <View style={styles.sectionPadding}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Технологии</Text>
            <TouchableOpacity><Text style={styles.allLink}>Все</Text></TouchableOpacity>
          </View>
          <View style={styles.chipWrapContainer}>
            {technologies.map(item => {
              const active = selectedTechnologies.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => toggleChip(item, selectedTechnologies, setSelectedTechnologies)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Thanh cố định nút "Показать 5810 товаров" ở đáy */}
      <View style={styles.bottomBarContainer}>
        <TouchableOpacity 
          style={styles.submitBtn} 
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.submitBtnText}>Показать 5 810 товаров</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  closeBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  
  sectionPadding: { paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  allLink: { fontSize: 14, color: '#888', fontWeight: '500' },
  sectionDivider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 12 },

  listItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  listItemLabel: { fontSize: 16, fontWeight: '600', color: '#111' },
  listItemSub: { fontSize: 13, color: '#005bff', marginTop: 2 },

  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  checkboxLabel: { fontSize: 16, fontWeight: '500', color: '#111' },

  /* Input khoảng giá */
  priceInputRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  priceBox: {
    flex: 1,
    backgroundColor: '#f6f6f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  priceSubLabel: { fontSize: 12, color: '#888' },
  priceValueText: { fontSize: 16, fontWeight: 'bold', color: '#111', marginTop: 2 },
  priceDash: { width: 10, height: 2, backgroundColor: '#ccc' },

  /* Các thẻ Chip lựa chọn */
  chipWrapContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#f6f6f8',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f6f6f8',
  },
  chipActive: {
    backgroundColor: '#eef3ff',
    borderColor: '#005bff',
  },
  chipText: { fontSize: 14, color: '#333', fontWeight: '500' },
  chipTextActive: { color: '#005bff', fontWeight: 'bold' },

  /* Chip kích thước vuông */
  sizeChip: {
    width: 48,
    height: 44,
    backgroundColor: '#f6f6f8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f6f6f8',
  },
  sizeChipActive: {
    backgroundColor: '#eef3ff',
    borderColor: '#005bff',
  },
  sizeChipText: { fontSize: 15, fontWeight: '600', color: '#111' },
  sizeChipTextActive: { color: '#005bff' },

  /* Thanh Nút ở đáy */
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  submitBtn: {
    backgroundColor: '#005bff',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});