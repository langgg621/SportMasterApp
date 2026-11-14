import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';

import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { ProductCard } from '../components/ProductCard';
import { CartEmptyState } from '../components/CartComponents/CartEmptyState';
import { CartQuantityModal } from '../components/CartComponents/CartQuantityModal';
import { CartSummary } from '../components/CartComponents/CartSummary';
import { productController } from '../controllers/productController';

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
    setIsFooterVisible(layoutMeasurement.height + contentOffset.y < contentSize.height - 50);
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

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={400}>
        
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <TouchableOpacity style={styles.locationBar}>
            <View style={styles.locationPin}><Ionicons name="location-sharp" size={14} color="#fff" /></View>
            <Text style={styles.locationText} numberOfLines={1}>{user?.address || 'Томск, Буяновский переулок, 3А'}</Text>
            <Ionicons name="chevron-forward" size={16} color="#888" />
          </TouchableOpacity>
        </View>

        {totalCount === 0 ? (
          <CartEmptyState onStartShopping={() => navigation.navigate('CatelogyTab')} />
        ) : (
          <View style={styles.cartContent}>
            <View style={styles.selectAllRow}>
              <TouchableOpacity style={styles.checkboxRow} onPress={toggleSelectAll}>
                <View style={[styles.checkbox, isAllSelected && styles.checkboxChecked]}>
                  {isAllSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={styles.selectAllText}>Выбрать все</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteSelected}>
                <Text style={styles.deleteText}>Удалить ({selectedCartItems.length})</Text>
              </TouchableOpacity>
            </View>

            {cartItems.map((item: any) => {
              const isChecked = !!selectedItems[item.id];
              return (
                <View key={item.id} style={styles.cartCard}>
                  <TouchableOpacity style={[styles.checkbox, isChecked && styles.checkboxChecked]} onPress={() => toggleSelectItem(item.id)}>
                    {isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </TouchableOpacity>
                  <Image source={{ uri: item.imageUrl }} style={styles.cardImg} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={styles.badgeRow}>
                      {item.discount && <View style={styles.discountBadge}><Text style={styles.discountText}>-{item.discount}%</Text></View>}
                    </View>
                    <Text style={styles.cardTitle} numberOfLines={2}>{item.productName}</Text>
                    <Text style={styles.cardMeta}>Цвет: {item.colorName || 'Черный'}</Text>
                    <Text style={styles.cardMeta}>Размер: {item.sizeName}</Text>
                    <View style={styles.priceQtyRow}>
                      <View>
                        {item.newPrice && <Text style={styles.cardOldPrice}>{item.price} ₽</Text>}
                        <Text style={styles.cardPrice}>{item.lineTotal?.toLocaleString()} ₽</Text>
                      </View>
                      <TouchableOpacity style={styles.qtyDropdownBtn} onPress={() => { setEditingItem(item); setTempQuantity(item.quantity); setQuantityModalVisible(true); }}>
                        <Text style={styles.qtyDropdownBtnText}>{item.quantity}</Text>
                        <Ionicons name="chevron-down" size={18} color="#111" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}

            <CartSummary promoCode={promoCode} setPromoCode={setPromoCode} useBonus={useBonus} setUseBonus={setUseBonus} totalPrice={totalSelectedPrice} bonusEarned={bonusEarned} />
          </View>
        )}

        {totalCount === 0 && hitProducts.length > 0 && (
          <View style={styles.hitsSection}>
            <Text style={styles.hitsTitle}>Хиты продаж</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContainer}>
              {hitProducts.map((item: any) => (
                <ProductCard key={item.id} item={item} onPress={() => navigation.navigate('ProductDetail', { productId: item.id })} onAddToCart={() => { const size = item.sizes?.[0]?.sizeID; if (size) addToCart(item.id, size, null, 1).catch((e: any) => alert(e.message)); }} />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {totalCount > 0 && totalSelectedPrice > 0 && isFooterVisible && (
        <View style={styles.floatingFooterPill}>
          <View style={styles.pillPriceBox}><Text style={styles.pillPrice}>{totalSelectedPrice.toLocaleString()} ₽</Text></View>
          <View style={styles.checkoutBtnWrapper}>
            <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('Checkout')}><Text style={styles.checkoutBtnText}>К оформлению</Text></TouchableOpacity>
            <View style={styles.coinBadge}><Text style={{ fontSize: 10 }}>🟡</Text><Text style={styles.coinText}>{bonusEarned}</Text></View>
          </View>
        </View>
      )}

      <CartQuantityModal visible={quantityModalVisible} currentQty={tempQuantity} onSelectQty={setTempQuantity} onClose={() => setQuantityModalVisible(false)} onSave={handleSaveQuantity} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderColor: '#f0f0f0', paddingHorizontal: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  shareBtn: { position: 'absolute', right: 16 },
  locationBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f6f8', padding: 12, borderRadius: 16 },
  locationPin: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#005bff', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  locationText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#111' },
  cartContent: { paddingHorizontal: 16, marginTop: 16 },
  selectAllRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginRight: 8, backgroundColor: '#fff' },
  checkboxChecked: { backgroundColor: '#005bff', borderColor: '#005bff' },
  selectAllText: { fontSize: 14, fontWeight: '600', color: '#111' },
  deleteText: { fontSize: 13, color: '#888' },
  cartCard: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  cardImg: { width: 72, height: 80, borderRadius: 8, resizeMode: 'cover', backgroundColor: '#f6f6f8' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  discountBadge: { backgroundColor: '#ff3b30', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  discountText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  cardTitle: { fontSize: 16, fontWeight: '500', color: '#111', lineHeight: 18, marginVertical: 6 },
  cardMeta: { fontSize: 13, color: '#888', marginTop: 2 },
  priceQtyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 },
  cardOldPrice: { fontSize: 12, color: '#aaa', textDecorationLine: 'line-through' },
  cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  qtyDropdownBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f6f8', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 6 },
  qtyDropdownBtnText: { fontSize: 14, fontWeight: '600', color: '#111' },
  hitsSection: { marginTop: 24, paddingHorizontal: 16 },
  hitsTitle: { fontSize: 20, fontWeight: '600', color: '#111', marginBottom: 16 },
  horizontalScrollContainer: { gap: 12, paddingBottom: 8 },
  floatingFooterPill: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#171d31', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 16, elevation: 10 },
  pillPriceBox: { flex: 1 },
  pillPrice: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  checkoutBtnWrapper: { position: 'relative' },
  checkoutBtn: { backgroundColor: '#005bff', paddingVertical: 8, paddingHorizontal: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  checkoutBtnText: { color: '#fff', fontSize: 18, fontWeight: '500' },
  coinBadge: { position: 'absolute', top: -10, right: -8, backgroundColor: '#fff', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderWidth: 2, borderColor: '#f2b80b' },
  coinText: { fontSize: 11, fontWeight: 'bold', color: '#111' },
});