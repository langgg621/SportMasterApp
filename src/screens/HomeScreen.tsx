import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { catalogController } from '../controllers/catalogController';
import { homeController } from '../controllers/homeController';
import { productController } from '../controllers/productController';
import { useCart } from '../hooks/useCart';

import { ProductCard } from '../components/ProductCard';
import { Product, Brand, CatalogSection, Category, Banner } from '../models';

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [selectedGender, setSelectedGender] = useState<'Женщинам' | 'Мужчинам' | 'Детям'>('Женщинам');
  const { addToCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sportsList, setSportsList] = useState<CatalogSection[]>([]);
  const [dailyDeals, setDailyDeals] = useState<Product[]>([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [brandsRes, catsRes, sectionsRes, dealsRes] = await Promise.all([
          catalogController.getBrands(),
          catalogController.getCategories(),
          homeController.getCatalogSections(),
          homeController.getDailyDeals(6),
        ]);
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
        
        {/* HEADER KHUYẾN MÃI (BANNER ĐỎ VÀ XANH) */}
        <View style={styles.scrollableTopSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topPromos}>
            {/* Banner Đỏ */}
            <View style={[styles.promoCard, { backgroundColor: '#ff4d4d' }]}>
              <TouchableOpacity style={styles.promoBtn}>
                <Text style={{ color: '#ff4d4d', fontWeight: '800', fontSize: 14 }}>Получить</Text>
              </TouchableOpacity>
              <Text style={styles.monthlyTitle}>Скидка{"\n"}месяца</Text>
              <Text style={{ color: 'white', fontSize: 12, marginTop: 8 }}>Только для вас!</Text>
            </View>

            {/* Banner Xanh */}
            <View style={[styles.promoCard, { backgroundColor: '#1c2230', marginLeft: 12 }]}>
              <Text style={{ color: '#fff', fontSize: 12, textAlign: 'right' }}>до 5 октября</Text>
              <Text style={[styles.monthlyTitle, { textAlign: 'right', marginTop: 8 }]}>СПЕЦ{"\n"}ТРАТИМ{"\n"}БОНУСЫ</Text>
              <Text style={{ color: '#ccc', fontSize: 11, textAlign: 'right', marginTop: 8 }}>по акции 100% кешбэк</Text>
            </View>
          </ScrollView>
        </View>

        {/* THANH TÌM KIẾM (STICKY) */}
        <View style={styles.stickySearchWrapper}>
          <View style={styles.topSearchRow}>
            <TouchableOpacity style={styles.search} onPress={() => navigation.navigate('SearchScreen')}>
              <Ionicons name="search-outline" size={20} color="#9ca6c2" />
              <Text style={{ color: '#9ca6c2', flex: 1, marginLeft: 8, fontSize: 16 }}>Искать в Спортмастере</Text>
              <Ionicons name="barcode-outline" size={20} color="#9ca6c2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate('SearchScreen')}>
              <Ionicons name="chatbubble-outline" size={24} color="#b7c0d8" />
              <View style={styles.chatBadge}><Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>1</Text></View>
            </TouchableOpacity>
          </View>
        </View>

        {/* NỘI DUNG CHÍNH */}
        <View style={styles.pageContent}>
          
          {/* Brands */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Бренды</Text>
              <TouchableOpacity><Text style={styles.allLinkText}>Все</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {brandsList.map((brand) => (
                <TouchableOpacity key={brand.id} style={styles.brandLogoBox}>
                  <Text style={{ fontWeight: 'bold', color: '#111' }}>{brand.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Khuyến mãi cá nhân */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.personalPromoBanner}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>Узнайте, как получить{"\n"}выгоду</Text>
              <View style={styles.personalPromoBadge}>
                <Text style={{ fontSize: 10, color: '#005bff' }}>персональная{"\n"}цена</Text>
              </View>
            </TouchableOpacity>
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
                <TouchableOpacity key={cat.id} style={styles.categoryCard} onPress={() => navigation.navigate('CatelogyTab')}>
                  <Image source={{ uri: cat.icon || 'https://via.placeholder.com/150' }} style={styles.categoryImg} />
                  <Text style={styles.categoryTitle}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sports */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Виды спорта</Text>
              <TouchableOpacity><Text style={styles.allLinkText}>Все</Text></TouchableOpacity>
            </View>
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
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Товары дня</Text>
              <TouchableOpacity><Text style={styles.allLinkText}>Все</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
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
  
  // Top Promo Section
  scrollableTopSection: { backgroundColor: '#171d31', paddingTop: 16, paddingBottom: 16 },
  topPromos: { gap: 12, paddingHorizontal: 16 },
  promoCard: { 
    width: 220, 
    height: 280, 
    borderRadius: 24, 
    padding: 20, 
    justifyContent: 'space-between',
    overflow: 'hidden'
  },
  promoBtn: { 
    width: 120, 
    height: 40, 
    backgroundColor: 'white', 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    alignSelf: 'center' 
  },
  monthlyTitle: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: 'white', 
    lineHeight: 36 
  },

  // Sticky Search Bar
  stickySearchWrapper: { backgroundColor: '#171d31', paddingHorizontal: 16, paddingVertical: 10, zIndex: 99 },
  topSearchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  search: { flex: 1, height: 44, backgroundColor: '#303950', borderRadius: 22, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  chatBtn: { position: 'relative' },
  chatBadge: { position: 'absolute', right: -4, top: -4, backgroundColor: '#f3203d', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },

  // Content
  pageContent: { paddingVertical: 8 },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '600', color: '#111' },
  allLinkText: { fontSize: 16, color: '#005bff', fontWeight: '500' },
  
  brandLogoBox: { width: 100, height: 56, borderRadius: 12, backgroundColor: '#f4f5f7', justifyContent: 'center', alignItems: 'center' },
  
  personalPromoBanner: { backgroundColor: '#00a2ff', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  personalPromoBadge: { backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, transform: [{ rotate: '-5deg' }] },

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