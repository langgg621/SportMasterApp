import React from 'react';
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
import { productController } from '../controllers/productController';
import FloatingNavBar from '../components/FloatingNavBar';

export default function CartScreen({ navigation }: { navigation: any }) {
  const hitProducts = productController.getProducts({}).slice(0, 4);
  const location = 'Томск, Буяновский переулок, 3А';
  const cartItemsCount = 0; 

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Корзина</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.locationBar}>
          <View style={styles.locationPin}>
            <Ionicons name="location-sharp" size={14} color="#fff" />
          </View>
          <Text style={styles.locationText} numberOfLines={1}>
            {location}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#888" />
        </TouchableOpacity>

        {cartItemsCount === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.illustrationWrapper}>
              <Image 
                source={require('../constants/cart_image.png')} 
                style={styles.emptyCartImage} 
                resizeMode="contain" 
              />
            </View>

            <Text style={styles.emptyTitle}>Вы пока не добавили товары</Text>

            <TouchableOpacity 
              style={styles.startShoppingBtn}
              onPress={() => navigation.navigate('CatelogyTab')}
            >
              <Text style={styles.startShoppingText}>Начать покупки</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.hitsSection}>
          <Text style={styles.hitsTitle}>Хиты продаж</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContainer}>
            {hitProducts.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.productCard}
                onPress={() => navigation.navigate('CatelogyTab')}
              >
                <View style={styles.productImageWrapper}>
                  <Image source={{ uri: item.images[0] }} style={styles.productImg} />
                  <View style={styles.floatingActions}>
                    <TouchableOpacity style={styles.actionIconBtn}>
                      <Ionicons name="heart-outline" size={16} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionIconBtn}>
                      <Ionicons name="scale-outline" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.productDetailsRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.productPrice}>{item.price} ₽</Text>
                      {item.discount && <Text style={styles.productDiscount}>{item.discount}</Text>}
                    </View>
                    <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.ratingText}><Text style={{ color: '#086ee7' }}>★</Text> 4.5</Text>
                  </View>

                  <TouchableOpacity style={styles.blueCartBtn}>
                    <Ionicons name="cart-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <FloatingNavBar 
        activeTab="Корзина"
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingVertical: 12, alignItems: 'center', borderBottomWidth: 1, borderColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f8',
    marginHorizontal: 16,
    marginTop: 14,
    padding: 12,
    borderRadius: 16,
  },
  locationPin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#005bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  locationText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#111' },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 10,
  },
  illustrationWrapper: {
    alignSelf: 'center',
    marginVertical: 10,
    marginRight:200
  },
  emptyCartImage: {
    width: 280,
    height: 220,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginVertical: 20,
    textAlign: 'center',
    marginTop:50
  },
  startShoppingBtn: {
    backgroundColor: '#005bff',
    width: '45%',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startShoppingText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  hitsSection: {
    marginTop: 50,
    paddingHorizontal: 16,
  },
  hitsTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111',
    marginBottom: 16,
    marginTop:40
  },
  horizontalScrollContainer: {
    gap: 12,
    paddingBottom: 8,
  },

  /* Styles đồng bộ chuẩn kích thước thẻ sản phẩm cuộn ngang */
  productCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  productImageWrapper: {
    width: '100%',
    height: 250,
    backgroundColor: '#f6f6f8',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  productImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  floatingActions: {
    position: 'absolute',
    top: 10,
    right: 10,
    gap: 6,
  },
  actionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  productDiscount: { fontSize: 12, color: '#ff3b30', fontWeight: 'bold' },
  productName: { fontSize: 13, color: '#333', marginTop: 4, height: 36, fontWeight: '500' },
  ratingText: { fontSize: 12, color: '#666', marginTop: 2 },
  blueCartBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#005bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});