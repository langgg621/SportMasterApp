import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import { productController } from '../controllers/productController';
import { catalogController } from '../controllers/catalogController';
import { systemKeyController } from '../controllers/systemKeyController';
import { FilterSection } from '../components/FilterSection';
import { CheckboxRow } from '../components/CheckboxRow';

const MAX_PRICE = 100000;

// 3 nhóm cấu hình gốc trong bảng system_key (không hardcode danh sách con)
const CONFIG_PARENT_IDS = {
  SECTIONS: 300, // Danh sách các nhóm filter (sizes, sportType, season...)
  FLAGS: 310,    // Danh sách checkbox cờ (onlySale, isBestPrice...)
  GENDERS: 320,  // Danh sách giới tính (1, 2, 3)
} as const;

export default function FilterScreen({ route, navigation }: { route: any; navigation: any }) {
  const insets = useSafeAreaInsets();
  const keyword = route?.params?.keyword || '';
  const categoryId = route?.params?.categoryId || '';
  const initialFilters = route?.params?.currentFilters || {};

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [counting, setCounting] = useState(false);
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [previewItems, setPreviewItems] = useState<any[]>([]);

  // Metadata động lấy từ bảng system_key
  const [sectionsMeta, setSectionsMeta] = useState<{ key: string; title: string; parentId: number }[]>([]);
  const [flagOptions, setFlagOptions] = useState<{ key: string; label: string }[]>([]);
  const [genderOptions, setGenderOptions] = useState<{ value: number; label: string }[]>([]);
  const [options, setOptions] = useState<Record<string, any[]>>({});

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(initialFilters.minPrice) || 0,
    Number(initialFilters.maxPrice) || MAX_PRICE,
  ]);
  const [gender, setGender] = useState<number | null>(
    initialFilters.gender ? Number(initialFilters.gender) : null
  );
  const [selected, setSelected] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    Object.entries(initialFilters).forEach(([k, v]) => {
      if (v && !['keyword', 'categoryId', 'gender', 'minPrice', 'maxPrice', 'sortBy', 'page', 'pageSize'].includes(k)) {
        init[k] = String(v).split(',');
      }
    });
    return init;
  });
  const [flags, setFlags] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    Object.entries(initialFilters).forEach(([k, v]) => {
      if (v === '1' || v === 1) init[k] = true;
    });
    return init;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Lấy cấu hình sections, flags, genders + brands, colors từ API
        const [brands, colors, rawSections, rawFlags, rawGenders] = await Promise.all([
          catalogController.getBrands(),
          catalogController.getColors(),
          systemKeyController.getByParentID(CONFIG_PARENT_IDS.SECTIONS),
          systemKeyController.getByParentID(CONFIG_PARENT_IDS.FLAGS),
          systemKeyController.getByParentID(CONFIG_PARENT_IDS.GENDERS),
        ]);

        const parsedSections = (rawSections || []).map((item: any) => ({
          key: item.codeKey || item.CodeKey,
          title: item.description || item.Description,
          parentId: Number(item.codeValue || item.CodeValue),
        }));

        const parsedFlags = (rawFlags || []).map((item: any) => ({
          key: item.codeKey || item.CodeKey,
          label: item.description || item.Description,
        }));

        const parsedGenders = (rawGenders || []).map((item: any) => ({
          value: Number(item.codeValue || item.CodeValue),
          label: item.description || item.Description,
        }));

        setSectionsMeta(parsedSections);
        setFlagOptions(parsedFlags);
        setGenderOptions(parsedGenders);

        // 2. Gọi động toàn bộ dữ liệu chip con theo parentId vừa lấy từ DB
        const sysResults = await Promise.all(
          parsedSections.map((s: any) => systemKeyController.getByParentID(s.parentId))
        );

        const mapped: Record<string, any[]> = {
          brandIds: brands || [],
          colorIds: colors || [],
        };
        parsedSections.forEach((s: any, idx: number) => {
          mapped[s.key] = sysResults[idx] || [];
        });
        setOptions(mapped);
      } catch (error) {
        console.error('FilterScreen fetchData error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Gom toàn bộ tham số filter đang chọn
  const buildFilters = useCallback(() => {
    const filters: Record<string, string> = {};
    if (categoryId) filters.categoryId = String(categoryId);
    if (keyword) filters.keyword = keyword;
    if (gender !== null) filters.gender = String(gender);
    if (priceRange[0] > 0) filters.minPrice = String(priceRange[0]);
    if (priceRange[1] < MAX_PRICE) filters.maxPrice = String(priceRange[1]);

    Object.entries(selected).forEach(([k, vals]) => {
      if (vals?.length > 0 && !flagOptions.some((f) => f.key === k)) {
        filters[k] = vals.join(',');
      }
    });
    Object.entries(flags).forEach(([k, checked]) => {
      if (checked) filters[k] = '1';
    });
    return filters;
  }, [categoryId, keyword, gender, priceRange, selected, flags, flagOptions]);

  // Cập nhật số lượng sản phẩm real-time trên nút xanh (debounce 300ms)
  useEffect(() => {
    if (loading) return;
    let isCancelled = false;
    setCounting(true);

    const timer = setTimeout(async () => {
      try {
        const filters = buildFilters();
        const queryString = new URLSearchParams(filters).toString();
        const res = await productController.getAll(queryString);
        const items = Array.isArray(res) ? res : res?.items ?? [];
        const total = res?.total;

        if (!isCancelled) {
          setPreviewItems(items);
          setPreviewCount(Number(total));
        }
      } catch (error) {
        console.error('FilterScreen preview count error:', error);
      } finally {
        if (!isCancelled) setCounting(false);
      }
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [loading, buildFilters]);

  const toggleChip = (key: string, val: string) => {
    setSelected((prev) => {
      const list = prev[key] || [];
      return {
        ...prev,
        [key]: list.includes(val) ? list.filter((i) => i !== val) : [...list, val],
      };
    });
  };

  const handleReset = () => {
    setPriceRange([0, MAX_PRICE]);
    setGender(null);
    setSelected({});
    setFlags({});
  };

  const handleApply = async () => {
    const filters = buildFilters();
    if (!counting && previewCount !== null) {
      navigation.navigate('SearchResult', { keyword, results: previewItems, filters });
      return;
    }

    setApplying(true);
    try {
      const queryString = new URLSearchParams(filters).toString();
      const res = await productController.getAll(queryString);
      const items = Array.isArray(res) ? res : res?.items ?? [];

      navigation.navigate('SearchResult', { keyword, results: items, filters });
    } catch (error) {
      console.error('FilterScreen handleApply error:', error);
      Alert.alert('Ошибка', 'Ошибка при фильтрации');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close-outline" size={28} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Фильтр</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>Сбросить</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Цена */}
        <View style={styles.sectionPadding}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Цена</Text>
            <Text style={styles.priceLabel}>
              {priceRange[0]} ₽ - {priceRange[1]} ₽
            </Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={MAX_PRICE}
            step={500}
            value={priceRange[1]}
            onValueChange={(val) => setPriceRange([priceRange[0], val])}
            minimumTrackTintColor="#005bff"
            maximumTrackTintColor="#d1d1d6"
          />
        </View>
        <View style={styles.divider} />

        {/* Пол (Lấy động từ system_key ParentID = 320) */}
        {genderOptions.length > 0 && (
          <>
            <View style={styles.sectionPadding}>
              <Text style={styles.sectionTitle}>Пол</Text>
              <View style={styles.chipRow}>
                {genderOptions.map((g) => {
                  const active = gender === g.value;
                  return (
                    <TouchableOpacity
                      key={g.value}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => setGender(active ? null : g.value)}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>{g.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View style={styles.divider} />
          </>
        )}

        {/* Бренд & Цвет */}
        <FilterSection
          title="Бренд"
          data={options.brandIds}
          selectedList={selected.brandIds || []}
          onSelect={(val: string) => toggleChip('brandIds', val)}
        />
        {options.brandIds?.length > 0 && <View style={styles.divider} />}

        <FilterSection
          title="Цвет"
          data={options.colorIds}
          selectedList={selected.colorIds || []}
          onSelect={(val: string) => toggleChip('colorIds', val)}
          renderIcon={(item: any) => (
            <View
              style={[
                styles.colorDot,
                { backgroundColor: item.colorType || item.ColorType || '#ccc' },
              ]}
            />
          )}
        />
        {options.colorIds?.length > 0 && <View style={styles.divider} />}

        {/* Các nhóm thuộc tính lấy động từ system_key (ParentID = 300) */}
        {sectionsMeta.map((sec) => {
          const list = options[sec.key] || [];
          if (list.length === 0) return null;
          return (
            <React.Fragment key={sec.key}>
              <FilterSection
                title={sec.title}
                data={list}
                selectedList={selected[sec.key] || []}
                onSelect={(val: string) => toggleChip(sec.key, val)}
              />
              <View style={styles.divider} />
            </React.Fragment>
          );
        })}

        {/* Các checkbox cờ sản phẩm lấy động từ system_key (ParentID = 310) */}
        {flagOptions.map((f) => (
          <CheckboxRow
            key={f.key}
            label={f.label}
            isChecked={!!flags[f.key]}
            onPress={() => setFlags((prev) => ({ ...prev, [f.key]: !prev[f.key] }))}
          />
        ))}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.submitBtn, previewCount === 0 && { opacity: 0.6 }]}
          onPress={handleApply}
          disabled={applying || previewCount === 0}
        >
          {applying || counting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>
              {previewCount !== null
                ? `Показать товары (${previewCount})`
                : 'Показать товары'}
            </Text>
          )}
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
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  resetText: { fontSize: 15, color: '#005bff', fontWeight: '500' },
  sectionPadding: { paddingHorizontal: 16, paddingTop: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 14, color: '#666' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 14 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f3f4f6' },
  chipActive: { backgroundColor: '#005bff' },
  chipText: { fontSize: 14, color: '#111' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  colorDot: {
    width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginRight: 6,
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, borderTopWidth: 1, borderColor: '#eee',
  },
  submitBtn: {
    backgroundColor: '#005bff', borderRadius: 12, height: 52, justifyContent: 'center', alignItems: 'center',
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});