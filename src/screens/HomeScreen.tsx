import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import Controllers & Hooks
import { catalogController } from '../controllers/catalogController';
import { homeController } from '../controllers/homeController';
import { productController } from '../controllers/productController';
import { useCart } from '../hooks/useCart';

// Import Component đã tách
import { ProductCard } from '../components/ProductCard';
import { HomeBanners } from '../components/HomeBanners';
import { Product, Brand, CatalogSection, Category, Banner} from '../models';

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [selectedGender, setSelectedGender] = useState<'Женщинам' | 'Мужчинам' | 'Детям'>('Женщинам');
  const { addToCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sportsList, setSportsList] = useState<CatalogSection[]>([]);
  const [dailyDeals, setDailyDeals] = useState<Product[]>([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [bannersRes, brandsRes, catsRes, sectionsRes, dealsRes] = await Promise.all([
          homeController.getBanners(1),
          catalogController.getBrands(),
          catalogController.getCategories(),
          homeController.getCatalogSections(),
          homeController.getDailyDeals(6),
        ]);
        setBanners(bannersRes || []);
        setBrandsList(brandsRes || []);
        setCategories(catsRes || []);
        setSportsList((sectionsRes || []).filter((s: any) => s.sectionType === 'sport'));
        setDailyDeals(dealsRes || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleQuickAdd = async (item: Product) => {
    const firstSize = item.sizes?.[0]?.sizeID;
    if (!firstSize) return alert('Нет в наличии');
    try {
      await addToCart(item.id, firstSize, item.colors?.[0]?.colorID || null, 1);
      alert('Добавлено в корзину!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, marginTop: 100 }} />;

  return (
    <SafeAreaView style={styles.phonePage}>
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
        
        {/* HEADER */}
        <View style={styles.scrollableTopSection}>
          <TouchableOpacity style={styles.bonusAlertContainer}>
            <Ionicons name="flame" size={16} color="#ffaa00" />
            <Text style={styles.bonusAlertText}>200 бонусов сгорят 20.03.2027</Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.stickySearchWrapper}>
          <TouchableOpacity style={styles.search} onPress={() => navigation.navigate('SearchScreen')}>
            <Ionicons name="search-outline" size={20} color="#9ca6c2" />
            <Text style={{ color: '#9ca6c2', flex: 1, marginLeft: 8, fontSize: 18 }}>Искать в Спортмастере</Text>
          </TouchableOpacity>
        </View>

        {/* NỘI DUNG */}
        <View style={styles.pageContent}>
          
          {/* Brands */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Бренды</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {brandsList.map((brand) => (
                <TouchableOpacity key={brand.id} style={styles.brandLogoBox}>
                  <Text style={{ fontWeight: 'bold' }}>{brand.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Dùng Component Banner đã tách */}
          <View style={styles.section}>
            <HomeBanners banners={banners} />
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <View style={styles.genderTabsContainer}>
              {['Женщинам', 'Мужчинам', 'Детям'].map((item: any) => (
                <TouchableOpacity key={item} onPress={() => setSelectedGender(item)}>
                  <Text style={[styles.genderTabText, selectedGender === item && styles.genderTabSelected]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.categoryGrid}>
              {categories.slice(0, 4).map((cat) => (
                <TouchableOpacity key={cat.id} style={styles.categoryCard}>
                  <Image source={{ uri: cat.icon || 'https://via.placeholder.com/150' }} style={styles.categoryImg} />
                  <Text style={styles.categoryTitle}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sports */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Виды спорта</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {sportsList.map((sport) => (
                <TouchableOpacity key={sport.id} style={styles.sportCard}>
                  <Image source={{ uri: sport.imageUrl }} style={styles.sportCardImg} />
                  <View style={styles.sportOverlay} />
                  <Text style={styles.sportTitle}>{sport.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Daily Deals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Товары дня</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {/* Dùng Component ProductCard đã tách */}
              {dailyDeals.map((item) => (
                <ProductCard 
                  key={item.id} 
                  item={item} 
                  badgeText="Товар дня" 
                  badgeColor="#8048e8"
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                  onAddToCart={() => handleQuickAdd(item)}
                />
              ))}
            </ScrollView>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  phonePage: { flex: 1, backgroundColor: '#fff' },
  scrollableTopSection: { backgroundColor: '#171d31', paddingTop: 12, paddingBottom: 16 },
  stickySearchWrapper: { backgroundColor: '#171d31', paddingHorizontal: 16, paddingVertical: 10, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, zIndex: 99 },
  bonusAlertContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#363c4f', borderRadius: 12, marginHorizontal: 16, padding: 12 },
  bonusAlertText: { color: '#fff', fontSize: 13, fontWeight: '500', marginLeft: 8 },
  search: { height: 40, backgroundColor: '#303950', borderRadius: 22, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  pageContent: { paddingVertical: 8 },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 24, fontWeight: '600', color: '#111', marginBottom: 16 },
  brandLogoBox: { width: 100, height: 50, borderRadius: 12, backgroundColor: '#f4f5f7', justifyContent: 'center', alignItems: 'center' },
  genderTabsContainer: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  genderTabText: { fontSize: 22, fontWeight: '600', color: '#8e8e93' },
  genderTabSelected: { color: '#101116' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  categoryCard: { width: '48%', height: 100, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f0f0ef' },
  categoryImg: { width: '100%', height: '100%', position: 'absolute' },
  categoryTitle: { fontSize: 18, fontWeight: '700', color: '#101116', padding: 6, zIndex: 2 },
  sportCard: { width: 160, height: 90, borderRadius: 16, overflow: 'hidden' },
  sportCardImg: { width: '100%', height: '100%', position: 'absolute' },
  sportOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.2)' },
  sportTitle: { fontSize: 20, fontWeight: '600', color: '#fff', zIndex: 2, margin: 15 },
});