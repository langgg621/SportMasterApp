import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Switch, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { productController } from '../controllers/productController';
import { ProductCard } from '../components/ProductCard';
import { CartQuantityModal } from '../components/CartComponents/CartQuantityModal'; // Tái sử dụng component Modal đã tạo trước đó

// Dữ liệu tĩnh cho các phương thức thanh toán
const PAYMENT_METHODS = [
  { id: 'split', title: 'Оплатить Яндекс Сплит', desc: 'Покупайте сразу, а оплату делите на части', icon: 'yandex', badge: 'Доступно' },
  { id: 'plait', title: 'Оплатить ПЛАЙТ', desc: 'Оплата частями', icon: 'card', badge: 'Доступно' },
  { id: 'sberbank', title: 'В рассрочку от СберБанка', desc: 'Не все товары в корзине доступны в рассрочку.', icon: 'bank', badge: null },
];

export default function CartScreen({ navigation }: { navigation: any }) {
  const { items: cartItems, totalCount, removeItem, updateQuantity, addToCart } = useCart();
  const { user } = useAuth();
  
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
  const [useBonus, setUseBonus] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [tempQuantity, setTempQuantity] = useState<number>(1);

  const [hitProducts, setHitProducts] = useState<any[]>([]);

  useEffect(() => {
    productController.getByFlag('new_collection', 4).then(setHitProducts).catch(console.error);
  }, []);

  useEffect(() => {
    setSelectedItems((prev) => {
      const next: { [key: string]: boolean } = {};
      cartItems.forEach((item: any) => { next[item.id] = prev[item.id] !== undefined ? prev[item.id] : true; });
      return next;
    });
  }, [cartItems]);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    // Hiện footer khi chưa cuộn tới cuối
    setIsFooterVisible(layoutMeasurement.height + contentOffset.y < contentSize.height - 100);
  };

  const toggleSelectItem = (id: string) => setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  const isAllSelected = cartItems.length > 0 && cartItems.every((item: any) => selectedItems[item.id]);
  const toggleSelectAll = () => {
    const nextState = !isAllSelected;
    const newSelected: { [key: string]: boolean } = {};
    cartItems.forEach((item: any) => { newSelected[item.id] = nextState; });
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = async () => {
    for (const item of cartItems) { if (selectedItems[item.id]) await removeItem(item.id); }
  };

  const handleSaveQuantity = async () => {
    if (editingItem) {
      try {
        await updateQuantity(editingItem.id, tempQuantity);
        setQuantityModalVisible(false);
      } catch (error: any) { alert(error.message); }
    }
  };

  const selectedCartItems = cartItems.filter((i: any) => selectedItems[i.id]);
  const totalSelectedPrice = selectedCartItems.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
  const bonusEarned = Math.floor(totalSelectedPrice * 0.05);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Корзина</Text>
        <TouchableOpacity style={styles.shareBtn}><Feather name="share" size={20} color="#111" /></TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 160 }} 
        showsVerticalScrollIndicator={false} 
        onScroll={handleScroll} 
        scrollEventThrottle={400}
      >
        {/* Địa chỉ & Banner giao hàng */}
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <TouchableOpacity style={styles.locationBar}>
            <View style={styles.locationPin}><Ionicons name="location-sharp" size={14} color="#fff" /></View>
            <Text style={styles.locationText} numberOfLines={1}>{user?.address || 'Томск, Буяновский переулок, 3А'}</Text>
            <Ionicons name="chevron-forward" size={16} color="#888" />
          </TouchableOpacity>
          
          <View style={styles.freeShipBanner}>
            <Text style={styles.freeShipText}>Ура! Для вас <Text style={{color: '#00a651', fontWeight: 'bold'}}>бесплатная доставка</Text></Text>
            <Ionicons name="chevron-forward" size={16} color="#888" />
          </View>
        </View>

        {totalCount === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Вы пока не добавили товары</Text>
            <TouchableOpacity style={styles.startShoppingBtn} onPress={() => navigation.navigate('CatelogyTab')}>
              <Text style={styles.startShoppingText}>Начать покупки</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cartContent}>
            {/* Thanh chọn tất cả & Xóa */}
            <View style={styles.selectAllRow}>
              <TouchableOpacity style={styles.checkboxRow} onPress={toggleSelectAll}>
                <View style={[styles.checkbox, isAllSelected && styles.checkboxChecked]}>
                  {isAllSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={styles.selectAllText}>Выбрать все</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteSelected}>
                <Text style={styles.deleteText}>Удалить {selectedCartItems.length > 0 ? `(${selectedCartItems.length})` : ''}</Text>
              </TouchableOpacity>
            </View>

            {/* Danh sách sản phẩm */}
            {cartItems.map((item: any) => {
              const isChecked = !!selectedItems[item.id];
              return (
                <View key={item.id} style={styles.cartCard}>
                  <TouchableOpacity style={[styles.checkbox, isChecked && styles.checkboxChecked]} onPress={() => toggleSelectItem(item.id)}>
                    {isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </TouchableOpacity>
                  
                  <Image source={{ uri: item.imageUrl }} style={styles.cardImg} />

                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={styles.itemHeaderRow}>
                      <Text style={styles.cardTitle} numberOfLines={2}>{item.productName}</Text>
                      <TouchableOpacity><Ionicons name="ellipsis-horizontal" size={18} color="#888" /></TouchableOpacity>
                    </View>
                    
                    <Text style={styles.cardMeta}>Цвет: {item.colorName || 'Черный'}</Text>
                    <Text style={styles.cardMeta}>Размер: {item.sizeName}</Text>

                    <View style={styles.priceQtyRow}>
                      <Text style={styles.cardPrice}>{item.lineTotal?.toLocaleString()} ₽</Text>
                      <TouchableOpacity style={styles.qtyDropdownBtn} onPress={() => { setEditingItem(item); setTempQuantity(item.quantity); setQuantityModalVisible(true); }}>
                        <Text style={styles.qtyDropdownBtnText}>{item.quantity}</Text>
                        <Ionicons name="chevron-down" size={16} color="#111" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.deliveryInfoRow}>
                      <Ionicons name="information-circle" size={16} color="#888" />
                      <Text style={styles.deliveryInfoText}>Доступен для экспресс доставки</Text>
                    </View>

                    <TouchableOpacity><Text style={styles.recommendLink}>Также рекомендуем</Text></TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {/* Mã giảm giá & Tính tiền */}
            <View style={{ marginTop: 16 }}>
              <View style={styles.promoInputBox}>
                <TextInput placeholder="Введите промокод" placeholderTextColor="#888" style={styles.promoInput} value={promoCode} onChangeText={setPromoCode} />
              </View>

              <View style={styles.summaryTableCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{selectedCartItems.length} товар</Text>
                  <Text style={styles.summaryValue}>{totalSelectedPrice.toLocaleString()} ₽</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryBoldLabel}>Итого</Text>
                  <Text style={styles.summaryBoldValue}>{totalSelectedPrice.toLocaleString()} ₽</Text>
                </View>
              </View>

              {/* KHỐI PHƯƠNG THỨC THANH TOÁN */}
              <View style={styles.paymentMethodsSection}>
                {PAYMENT_METHODS.map((method) => (
                  <TouchableOpacity key={method.id} style={styles.paymentMethodCard}>
                    <View style={styles.paymentIconBox}>
                      {method.id === 'split' && <Text style={{color: '#005bff', fontWeight: 'bold'}}>LP</Text>}
                      {method.id === 'plait' && <MaterialCommunityIcons name="credit-card-outline" size={24} color="#005bff" />}
                      {method.id === 'sberbank' && <MaterialCommunityIcons name="bank-outline" size={24} color="#005bff" />}
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.paymentTitle}>{method.title}</Text>
                        {method.badge && <View style={styles.tagAvailable}><Text style={styles.tagAvailableText}>{method.badge}</Text></View>}
                      </View>
                      <Text style={styles.paymentDesc}>{method.desc}</Text>
                      {method.id === 'sberbank' && <Text style={styles.linkText}>Посмотреть товары</Text>}
                    </View>
                    <Ionicons name="information-circle-outline" size={20} color="#ccc" />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.fullCheckoutBtn} onPress={() => navigation.navigate('Checkout')}>
                <Text style={styles.fullCheckoutText}>Перейти к оформлению</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* THANH THANH TOÁN NỔI (Floating Footer) */}
      {totalCount > 0 && totalSelectedPrice > 0 && isFooterVisible && (
        <View style={styles.floatingFooterPill}>
          <Text style={styles.pillPrice}>{totalSelectedPrice.toLocaleString()} ₽</Text>
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('Checkout')}>
            <Text style={styles.checkoutBtnText}>К оформлению</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal chọn số lượng */}
      <CartQuantityModal visible={quantityModalVisible} currentQty={tempQuantity} onSelectQty={setTempQuantity} onClose={() => setQuantityModalVisible(false)} onSave={handleSaveQuantity} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderColor: '#f0f0f0' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  shareBtn: { position: 'absolute', right: 16 },
  locationBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f6f8', padding: 12, borderRadius: 16 },
  locationPin: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#005bff', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  locationText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#111' },
  freeShipBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#eafbf1', padding: 12, borderRadius: 16, marginTop: 8 },
  freeShipText: { fontSize: 13, color: '#111' },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  startShoppingBtn: { backgroundColor: '#005bff', paddingHorizontal: 32, height: 48, borderRadius: 12, justifyContent: 'center' },
  startShoppingText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cartContent: { paddingHorizontal: 16, marginTop: 16 },
  selectAllRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginRight: 10, backgroundColor: '#fff' },
  checkboxChecked: { backgroundColor: '#005bff', borderColor: '#005bff' },
  selectAllText: { fontSize: 15, fontWeight: '500', color: '#111' },
  deleteText: { fontSize: 14, color: '#888' },
  cartCard: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  cardImg: { width: 80, height: 100, borderRadius: 8, resizeMode: 'cover', backgroundColor: '#f6f6f8' },
  itemHeaderRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardTitle: { fontSize: 16, fontWeight: '400', color: '#111', flex: 1, marginRight: 10 },
  cardMeta: { fontSize: 14, color: '#888', marginTop: 6 },
  priceQtyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  cardPrice: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  qtyDropdownBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f6f8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 8 },
  qtyDropdownBtnText: { fontSize: 14, fontWeight: '500', color: '#111' },
  deliveryInfoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 6 },
  deliveryInfoText: { fontSize: 13, color: '#666' },
  recommendLink: { fontSize: 14, color: '#005bff', marginTop: 10 },
  promoInputBox: { backgroundColor: '#f6f6f8', borderRadius: 12, paddingHorizontal: 16, height: 54, justifyContent: 'center', marginBottom: 16 },
  promoInput: { fontSize: 15, color: '#111' },
  summaryTableCard: { backgroundColor: '#f6f6f8', borderRadius: 16, padding: 16, marginBottom: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 15, color: '#666' },
  summaryValue: { fontSize: 15, color: '#666' },
  summaryBoldLabel: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  summaryBoldValue: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  
  // Phương thức thanh toán
  paymentMethodsSection: { marginBottom: 20 },
  paymentMethodCard: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  paymentIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#eef3ff', justifyContent: 'center', alignItems: 'center' },
  paymentTitle: { fontSize: 16, fontWeight: '500', color: '#111' },
  paymentDesc: { fontSize: 14, color: '#666', marginTop: 4, lineHeight: 20 },
  tagAvailable: { backgroundColor: '#00c853', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagAvailableText: { fontSize: 11, fontWeight: 'bold', color: '#fff' },
  linkText: { fontSize: 14, color: '#005bff', marginTop: 8 },
  
  fullCheckoutBtn: { backgroundColor: '#005bff', height: 54, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  fullCheckoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  floatingFooterPill: { position: 'absolute', bottom: 120, left: 16, right: 16, backgroundColor: '#171d31', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 16, elevation: 10 },
  pillPrice: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  checkoutBtn: { backgroundColor: '#005bff', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  checkoutBtnText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});