import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FloatingNavBar from '../components/FloatingNavBar';

export default function CatalogScreen({ navigation }: { navigation: any }) {
  const [activeTab, setActiveTab] = useState('Каталог');

  // Dữ liệu hàng nút dịch vụ phía trên (Скидки, Подарочные карты, Оплата частями, Сервис...)
  const serviceCards = [
    { id: '1', title: 'Скидки и акции', image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400' },
    { id: '2', title: 'Подарочные карты', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400' },
    { id: '3', title: 'Оплата частями', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400' },
    { id: '4', title: 'Сервис по подбору товаров', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400' },
  ];

  // Dữ liệu phân mục theo đối tượng (Женщинам, Мужчинам, Детям)
  const genderCards = [
    { id: 'g1', title: 'Женщинам', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400' },
    { id: 'g2', title: 'Мужчинам', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400' },
    { id: 'g3', title: 'Детям и подросткам', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400' },
  ];

  // Dữ liệu danh mục sản phẩm chung (Одежда, Обувь, Аксессуары)
  const categoryCards = [
    { id: 'c1', title: 'Одежда', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400' },
    { id: 'c2', title: 'Обувь', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    { id: 'c3', title: 'Аксессуары', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
  ];

  // Dữ liệu theo bộ môn thể thao (Тренажеры, Бег, Плавание...)
  const sportCards = [
    { id: 's1', title: 'Тренажеры, фитнес', image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400' },
    { id: 's2', title: 'Бег, ходьба', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    { id: 's3', title: 'Плавание', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Header Top Bar */}
      <View style={styles.topSearchRow}>
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('SearchTab')}>
          <Ionicons name="search-outline" size={18} color="#8e8e93" style={{ marginRight: 8 }} />
          <Text style={styles.searchText}>Искать в Спортмастере</Text>
          <Ionicons name="barcode-outline" size={20} color="#8e8e93" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate('ChatTab')}>
          <Ionicons name="chatbubble-outline" size={22} color="#111" />
          <View style={styles.chatBadge}><Text style={styles.chatBadgeText}>6</Text></View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        
        {/* 1. Hàng thẻ dịch vụ ngang (Скидки, Подарочные карты...) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {serviceCards.map((item) => (
            <TouchableOpacity key={item.id} style={styles.serviceCard} activeOpacity={0.9}>
              <Text style={styles.serviceTitle} numberOfLines={2}>{item.title}</Text>
              <Image source={{ uri: item.image }} style={styles.serviceImg} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 2. Phân mục nhóm đối tượng (Женщинам, Мужчинам, Детям...) */}
        <View style={styles.gridContainer}>
          {genderCards.map((item) => (
            <TouchableOpacity key={item.id} style={styles.gridCardLarge} activeOpacity={0.9}>
              <View style={styles.cardTextWrapper}>
                <Text style={styles.gridTitleLarge}>{item.title}</Text>
              </View>
              <Image source={{ uri: item.image }} style={styles.gridImgLarge} />
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. Phân mục sản phẩm (Одежда, Обувь, Аксессуары) */}
        <View style={styles.gridContainer}>
          {categoryCards.map((item) => (
            <TouchableOpacity key={item.id} style={styles.gridCardLarge} activeOpacity={0.9}>
              <View style={styles.cardTextWrapper}>
                <Text style={styles.gridTitleLarge}>{item.title}</Text>
              </View>
              <Image source={{ uri: item.image }} style={styles.gridImgLarge} />
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. Phân mục theo bộ môn thể thao (Тренажеры, Бег, Плавание) */}
        <View style={styles.gridContainer}>
          {sportCards.map((item) => (
            <TouchableOpacity key={item.id} style={styles.gridCardLarge} activeOpacity={0.9}>
              <View style={styles.cardTextWrapper}>
                <Text style={styles.gridTitleLarge}>{item.title}</Text>
              </View>
              <Image source={{ uri: item.image }} style={styles.gridImgLarge} />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Thanh điều hướng nổi phía dưới */}
      <FloatingNavBar 
        activeTab="Каталог" // Phải viết đúng là "Каталог" để khớp với label trong navItems
        onTabPress={(tab) => {
          if (tab === 'Главная') navigation.navigate('HomeTab');
          if (tab === 'Каталог') navigation.navigate('CatalogTab');
          if (tab === 'Сервисы') navigation.navigate('ServicesTab');
          if (tab === 'Корзина') navigation.navigate('CartTab');
          if (tab === 'Профиль') navigation.navigate('ProfileTab');
        }}
        onStorePress={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topSearchRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    backgroundColor: '#fff' 
  },
  searchBar: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f1f2f6', 
    borderRadius: 22, 
    paddingHorizontal: 14, 
    height: 44, 
    marginRight: 10 
  },
  searchText: { flex: 1, color: '#8e8e93', fontSize: 15 },
  chatBtn: { position: 'relative', padding: 6, justifyContent: 'center', alignItems: 'center' },
  chatBadge: { 
    position: 'absolute', 
    right: -2, 
    top: 0, 
    width: 18, 
    height: 18, 
    borderRadius: 9, 
    backgroundColor: '#f3203d', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  chatBadgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },

  horizontalScroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  serviceCard: { 
    width: 92, 
    height: 120, 
    backgroundColor: '#f2f4f8', 
    borderRadius: 16, 
    padding: 10, 
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative'
  },
  serviceTitle: { fontSize: 12, fontWeight: '700', color: '#111', zIndex: 2, lineHeight: 15 },
  serviceImg: { 
    width: 70, 
    height: 70, 
    position: 'absolute', 
    bottom: -5, 
    right: -5, 
    resizeMode: 'contain' 
  },

  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingHorizontal: 16, 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },
  gridCardLarge: { 
    width: '31.5%', 
    height: 170, 
    backgroundColor: '#f2f4f8', 
    borderRadius: 16, 
    padding: 12, 
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12
  },
  cardTextWrapper: { zIndex: 2, width: '100%' },
  gridTitleLarge: { fontSize: 13, fontWeight: 'bold', color: '#111', lineHeight: 16 },
  gridImgLarge: { 
    width: '100%', 
    height: 110, 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    left: 0,
    resizeMode: 'cover',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16
  },
});