import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FloatingNavBar from '../components/FloatingNavBar';
import { cartController } from '../controllers/cartController';
interface ServiceItem {
  id: string;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  bgColor: string;
}

interface ServiceSection {
  title: string;
  items: ServiceItem[];
}

export default function ServicesScreen({ navigation }: { navigation: any }) {
  const location = 'Томск, Буяновский переулок, 3А';

  // Dữ liệu các nhóm dịch vụ theo hình ảnh
  const sections: ServiceSection[] = [
    {
      title: 'Ваш Спортмастер',
      items: [
        { id: '1', title: 'Бонусная\nкарта', iconName: 'qr-code-outline', bgColor: '#3b82f6' },
        { id: '2', title: 'Акции', iconName: 'pricetag-outline', bgColor: '#ff4d6d' },
        { id: '3', title: 'Магазины', iconName: 'bag-handle-outline', bgColor: '#0066ff' },
        { id: '4', title: 'Сервисные\nуслуги', iconName: 'construct-outline', bgColor: '#6366f1' },
        { id: '5', title: 'Задать\nвопрос', iconName: 'chatbubble-ellipses-outline', bgColor: '#38bdf8' },
      ],
    },
    {
      title: 'Спорт',
      items: [
        { id: 's1', title: 'Трекер\nактивности', iconName: 'flame-outline', bgColor: '#ff7b00' },
        { id: 's2', title: 'Онлайн\nтренировки', iconName: 'barbell-outline', bgColor: '#38bdf8' },
        { id: 's3', title: 'Онлайн\nкурсы', iconName: 'laptop-outline', bgColor: '#818cf8' },
        { id: 's4', title: 'Счетчик\nкалорий', iconName: 'clipboard-outline', bgColor: '#facc15' },
        { id: 's5', title: 'Беговой\nТренер', iconName: 'fitness-outline', bgColor: '#a855f7' },
      ],
    },
    {
      title: 'Досуг',
      items: [
        { id: 'd1', title: 'Live\nтрансляции', iconName: 'megaphone-outline', bgColor: '#ff4d6d' },
        { id: 'd2', title: 'Медиа', iconName: 'image-outline', bgColor: '#6366f1' },
      ],
    },
    {
      title: 'Активный отдых',
      items: [
        { id: 'a1', title: 'Афиша', iconName: 'calendar-outline', bgColor: '#f472b6' },
        { id: 'a2', title: 'Маршруты', iconName: 'location-outline', bgColor: '#0284c7' },
        { id: 'a3', title: 'Беговые\nтренировки', iconName: 'trophy-outline', bgColor: '#7c3aed' },
      ],
    },
  ];
// Lấy danh sách sản phẩm trong giỏ hàng hiện tại
  const cartState = cartController.getCartState();
  const cartItems = cartState?.items || [];
  
  // Tính tổng số lượng tất cả mặt hàng trong giỏ
  const totalCartCount = cartItems.reduce((sum: number, item: any) => sum + (item?.quantity || 0), 0);
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Thanh địa chỉ & Chat Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.locationBar}>
          <View style={styles.locationPin}>
            <Ionicons name="location-sharp" size={14} color="#fff" />
          </View>
          <Text style={styles.locationText} numberOfLines={1}>
            {location}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate('SearchScreen')}>
          <Ionicons name="chatbubble-outline" size={22} color="#111" />
          <View style={styles.chatBadge}><Text style={styles.chatBadgeText}>6</Text></View>
        </TouchableOpacity>
      </View>

      {/* Danh sách cuộn các nhóm dịch vụ */}
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        {sections.map((section, idx) => (
          <View key={idx} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {section.items.map((item) => (
                <TouchableOpacity key={item.id} style={styles.serviceItem} activeOpacity={0.8}>
                  <View style={[styles.iconBox, { backgroundColor: item.bgColor }]}>
                    <Ionicons name={item.iconName} size={28} color="#fff" />
                  </View>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>

      {/* FloatingNavBar chọn tab Сервисы */}
      <FloatingNavBar 
        activeTab="Сервисы"
        cartCount={totalCartCount}
        onTabPress={(tab) => {
          if (tab === 'Главная') navigation.navigate('HomeTab');
          if (tab === 'Каталог') navigation.navigate('CatelogyTab');
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
  container: { flex: 1, backgroundColor: '#f5f6f8' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f5f6f8',
  },
  locationBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  locationPin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#005bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  locationText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#111' },

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
    alignItems: 'center',
  },
  chatBadgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },

  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  serviceItem: {
    width: 72,
    alignItems: 'center',
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemTitle: {
    fontSize: 11,
    color: '#111',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },
});