import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { productController } from '../controllers/productController';
import { cartController } from '../controllers/cartController';

export default function CartScreen({ navigation }: { navigation: any }) {
  const hitProducts = productController.getProducts({}).slice(0, 4);
  const location = 'Томск, Буяновский переулок, 3А';

  const [cartState, setCartState] = useState<any>({ items: [] });
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
  const [useBonus, setUseBonus] = useState(true);
  const [promoCode, setPromoCode] = useState('');

  // State quản lý Modal chọn số lượng
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [tempQuantity, setTempQuantity] = useState<number>(1);

  const paymentMethods = cartController.getPaymentMethod ? cartController.getPaymentMethod() : [];

  const loadCartData = useCallback(() => {
    try {
      const currentCart = cartController.getCartState();
      const items = currentCart?.items || [];
      setCartState(currentCart || { items: [] });

      // Cập nhật selectedItems nhưng giữ nguyên trạng thái đã tick của các item cũ,
      // đồng thời mặc định tick true cho item mới thêm vào.
      setSelectedItems((prev) => {
        const updatedSelected: { [key: string]: boolean } = {};
        items.forEach((item: any) => {
          updatedSelected[item.id] = prev[item.id] !== undefined ? prev[item.id] : true;
        });
        return updatedSelected;
      });
    } catch (error) {
      setCartState({ items: [] });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCartData();
    }, [loadCartData])
  );

  const cartItems = cartState?.items || [];
  const cartItemsCount = cartItems.reduce((sum: number, item: any) => sum + (item?.quantity || 0), 0);

  // Checkbox chọn từng item
  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Checkbox chọn tất cả
  const isAllSelected = cartItems.length > 0 && cartItems.every((item: any) => selectedItems[item.id]);
  const toggleSelectAll = () => {
    const nextState = !isAllSelected;
    const newSelected: { [key: string]: boolean } = {};
    cartItems.forEach((item: any) => {
      newSelected[item.id] = nextState;
    });
    setSelectedItems(newSelected);
  };

  const selectedCount = cartItems.filter((item: any) => selectedItems[item.id]).length;

  // Xóa sản phẩm đã chọn
  const handleDeleteSelected = () => {
    cartItems.forEach((item: any) => {
      if (selectedItems[item.id]) {
        cartController.removeItem(item.id);
      }
    });
    loadCartData();
  };

  // Mở modal chọn số lượng
  const openQuantityModal = (item: any) => {
    setEditingItem(item);
    setTempQuantity(item.quantity || 1);
    setQuantityModalVisible(true);
  };

  // Lưu số lượng mới từ modal
  const handleSaveQuantity = () => {
    if (editingItem) {
      cartController.changeItemQuantity(editingItem.id, tempQuantity);
      loadCartData();
    }
    setQuantityModalVisible(false);
  };

const totalSelectedPrice = cartItems.reduce((sum: number, item: any) => {
    if (!selectedItems[item.id]) return sum; 
    const cleanPrice = parseInt(String(item?.product?.price || '0').replace(/[^0-9]/g, ''), 10) || 0;
    return sum + cleanPrice * (item?.quantity || 1);
  }, 0);

  // Kiểm tra nếu sản phẩm có giảm giá thực tế từ dữ liệu sản phẩm
  const availableBonus = totalSelectedPrice > 0 ? 200 : 0;
  const bonusDiscount = useBonus && totalSelectedPrice > 0 ? availableBonus : 0;
  
  // Tổng tiền cuối cùng phải trả = Tổng giá sản phẩm được chọn - Điểm thưởng (nếu có bật switch)
  const finalCalculatedPrice = Math.max(0, totalSelectedPrice - bonusDiscount);
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Корзина</Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Feather name="share" size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }} showsVerticalScrollIndicator={false}>
        {/* Địa chỉ & Banner giao hàng */}
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <TouchableOpacity style={styles.locationBar}>
            <View style={styles.locationPin}>
              <Ionicons name="location-sharp" size={14} color="#fff" />
            </View>
            <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
            <Ionicons name="chevron-forward" size={16} color="#888" />
          </TouchableOpacity>
        </View>

        {cartItemsCount === 0 ? (
          /* TRƯỜNG HỢP TRỐNG */
          <View style={styles.emptyContainer}>
            <View style={styles.illustrationWrapper}>
              <Image source={require('../constants/cart_image.png')} style={styles.emptyCartImage} resizeMode="contain" />
            </View>
            <Text style={styles.emptyTitle}>Вы пока не добавили товары</Text>
            <TouchableOpacity style={styles.startShoppingBtn} onPress={() => navigation.navigate('CatelogyTab')}>
              <Text style={styles.startShoppingText}>Начать покупки</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* TRƯỜNG HỢP CÓ SẢN PHẨM */
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
                <Text style={styles.deleteText}>Удалить {selectedCount > 0 ? `(${selectedCount})` : ''}</Text>
              </TouchableOpacity>
            </View>

            {/* Danh sách sản phẩm trong giỏ */}
            {cartItems.map((item: any) => {
              const isChecked = !!selectedItems[item.id];
              const unitPrice = parseInt(String(item?.product?.price || '0').replace(/[^0-9]/g, ''), 10) || 0;
              const itemTotalPrice = unitPrice * (item.quantity || 1);

              return (
                <View key={item.id} style={styles.cartCard}>
                  <TouchableOpacity 
                    style={[styles.checkbox, isChecked && styles.checkboxChecked]} 
                    onPress={() => toggleSelectItem(item.id)}
                  >
                    {isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </TouchableOpacity>

                  <Image source={{ uri: item?.product?.images?.[0] }} style={styles.cardImg} />

                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={styles.badgeRow}>
                      {item?.product?.discount && (
                        <View style={styles.discountBadge}>
                          <Text style={styles.discountText}>{item.product.discount}</Text>
                        </View>
                      )}
                      <View style={styles.myDiscountBadge}>
                        <Text style={styles.myDiscountText}>Моя скидка</Text>
                      </View>
                    </View>

                    <Text style={styles.cardTitle} numberOfLines={2}>{item?.product?.name}</Text>
                    <Text style={styles.cardMeta}>Цвет: {item?.product?.colors?.[0] || 'Черный'}</Text>
                    <Text style={styles.cardMeta}>Размер: {item?.size || '39.5'}</Text>

                    <View style={styles.priceQtyRow}>
                      <View>
                        {item?.product?.oldPrice && <Text style={styles.cardOldPrice}>{item.product.oldPrice}</Text>}
                        <Text style={styles.cardPrice}>{itemTotalPrice.toLocaleString()} ₽</Text>
                      </View>

                      {/* Dropdown nút chọn số lượng dạng Modal picker */}
                      <TouchableOpacity style={styles.qtyDropdownBtn} onPress={() => openQuantityModal(item)}>
                        <Text style={styles.qtyDropdownBtnText}>{item.quantity}</Text>
                        <Ionicons name="chevron-down" size={14} color="#111" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.recommendLink}>Также рекомендуем</Text>
                  </View>
                </View>
              );
            })}

            {/* Mã giảm giá & Banner */}
            <View style={{ marginTop: 16 }}>
              <View style={styles.promoInputBox}>
                <TextInput
                  placeholder="Введите промокод"
                  placeholderTextColor="#888"
                  style={styles.promoInput}
                  value={promoCode}
                  onChangeText={setPromoCode}
                />
              </View>

              {/* Khối Bonus Toggle */}
              <View style={styles.bonusToggleCard}>
                <Text style={styles.bonusCardTitle}>Списать {availableBonus} бонусов</Text>
                <Switch
                  trackColor={{ false: '#d0d0d0', true: '#005bff' }}
                  thumbColor={'#fff'}
                  disabled={totalSelectedPrice === 0}
                  onValueChange={() => setUseBonus((prev) => !prev)}
                  value={useBonus && totalSelectedPrice > 0}
                />
              </View>

              {totalSelectedPrice === 0 && (
                <View style={styles.warningBox}>
                  <Ionicons name="information-circle-outline" size={14} color="#f5a623" />
                  <Text style={styles.warningText}>Для этого заказа нельзя списать бонусы</Text>
                </View>
              )}

              {/* Bảng tổng kết tiền */}
              <View style={styles.summaryTableCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Товаров</Text>
                  <Text style={styles.summaryValue}>{totalSelectedPrice.toLocaleString()} ₽</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Итого</Text>
                  <Text style={styles.summaryValue}>{totalSelectedPrice.toLocaleString()} ₽</Text>
                </View>

                {totalSelectedPrice > 0 && (
                  <View style={styles.bonusCashbackRow}>
                    <Text style={styles.cashbackText}>Бонусы за покупку</Text>
                    <View style={styles.cashbackBadge}>
                      <Text style={{ fontSize: 11 }}>🟡</Text>
                      <Text style={styles.cashbackBadgeText}>+300</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Các phương thức thanh toán */}
              {paymentMethods.map((method: any) => (
                <TouchableOpacity key={method.id} style={styles.paymentMethodCard}>
                  <View style={styles.paymentIconBox}>
                    {method.isIonIcon ? (
                      <Ionicons name={method.icon as any} size={20} color="#005bff" />
                    ) : (
                      <MaterialCommunityIcons name={method.icon as any} size={20} color="#005bff" />
                    )}
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.paymentTitle}>{method.title}</Text>
                      <View style={styles.tagAvailable}><Text style={styles.tagAvailableText}>Доступно</Text></View>
                    </View>
                    <Text style={styles.paymentDesc} numberOfLines={1}>{method.desc}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#888" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Sản phẩm gợi ý khi giỏ hàng trống */}
        {cartItemsCount === 0 && (
          <View style={styles.hitsSection}>
            <Text style={styles.hitsTitle}>Хиты продаж</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContainer}>
              {hitProducts.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.productCard}
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                >
                  <View style={styles.productImageWrapper}>
                    <Image source={{ uri: item.images[0] }} style={styles.productImg} />
                  </View>
                  <View style={styles.productDetailsRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.productPrice}>{item.price} ₽</Text>
                      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.blueCartBtn}
                      onPress={() => {
                        cartController.addProductToCart(item, 1, item.sizes?.[0] || 'Standard');
                        loadCartData();
                      }}
                    >
                      <Ionicons name="cart-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Floating Footer Thanh toán */}
      {cartItemsCount > 0 && totalSelectedPrice > 0 && (
        <View style={styles.floatingFooterPill}>
          <View style={styles.pillPriceBox}>
            <Text style={styles.pillPrice}>{finalCalculatedPrice.toLocaleString()} ₽</Text>
          </View>
          <View style={styles.checkoutBtnWrapper}>
            <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('Checkout')}>
              <Text style={styles.checkoutBtnText}>К оформлению</Text>
            </TouchableOpacity>
            <View style={styles.coinBadge}>
              <Text style={{ fontSize: 10 }}>🟡</Text>
              <Text style={styles.coinText}>300</Text>
            </View>
          </View>
        </View>
      )}

      {/* MODAL BOTTOM SHEET CHỌN SỐ LƯỢNG (QUANTITY PICKER) */}
      <Modal visible={quantityModalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setQuantityModalVisible(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Количество</Text>

            <ScrollView style={styles.pickerScrollView} showsVerticalScrollIndicator={false}>
              {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[styles.pickerOption, tempQuantity === num && styles.pickerOptionSelected]}
                  onPress={() => setTempQuantity(num)}
                >
                  <Text style={[styles.pickerOptionText, tempQuantity === num && styles.pickerOptionTextSelected]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveQuantity}>
              <Text style={styles.modalSaveBtnText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderColor: '#f0f0f0', paddingHorizontal: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  shareBtn: { position: 'absolute', right: 16 },
  locationBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f6f8', padding: 12, borderRadius: 16 },
  locationPin: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#005bff', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  locationText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#111' },
  freeShipBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#eafbf1', padding: 12, borderRadius: 16, marginTop: 8 },
  freeShipText: { fontSize: 13, color: '#111' },
  emptyContainer: { alignItems: 'center', paddingHorizontal: 24, marginTop: 10 },
  illustrationWrapper: { alignSelf: 'center', marginVertical: 10 },
  emptyCartImage: { width: 240, height: 180 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#111', marginVertical: 16, textAlign: 'center' },
  startShoppingBtn: { backgroundColor: '#005bff', paddingHorizontal: 32, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  startShoppingText: { color: '#fff', fontSize: 16, fontWeight: '600' },
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
  discountBadge: { backgroundColor: '#ff3b30', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  discountText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  myDiscountBadge: { backgroundColor: '#ffebe8', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  myDiscountText: { color: '#ff3b30', fontSize: 10, fontWeight: '600' },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#111', lineHeight: 18 },
  cardMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  priceQtyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 },
  cardOldPrice: { fontSize: 12, color: '#aaa', textDecorationLine: 'line-through' },
  cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  qtyDropdownBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f6f8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 6 },
  qtyDropdownBtnText: { fontSize: 14, fontWeight: '600', color: '#111' },
  recommendLink: { fontSize: 12, color: '#005bff', fontWeight: '600', marginTop: 8 },
  promoInputBox: { backgroundColor: '#f6f6f8', borderRadius: 12, paddingHorizontal: 16, height: 48, justifyContent: 'center', marginBottom: 12 },
  promoInput: { fontSize: 14, color: '#111' },
  promoBannerCard: { flexDirection: 'row', backgroundColor: '#1b233a', borderRadius: 16, padding: 14, alignItems: 'center', marginBottom: 12 },
  bannerTitle: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  bannerSub: { color: '#9ba2b4', fontSize: 11, marginTop: 4 },
  bannerThumb: { width: 50, height: 50, borderRadius: 8, marginLeft: 10 },
  bonusToggleCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f6f6f8', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16 },
  bonusCardTitle: { fontSize: 15, fontWeight: 'bold', color: '#111' },
  warningBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fffbe6', padding: 10, borderRadius: 8, marginTop: 8, gap: 6 },
  warningText: { fontSize: 12, color: '#d9822b' },
  summaryTableCard: { backgroundColor: '#f6f6f8', borderRadius: 16, padding: 16, marginVertical: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#111' },
  bonusCashbackRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  cashbackText: { fontSize: 13, color: '#666' },
  cashbackBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, gap: 4 },
  cashbackBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#111' },
  paymentMethodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f6f8', padding: 14, borderRadius: 16, marginBottom: 8 },
  paymentIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#eef3ff', justifyContent: 'center', alignItems: 'center' },
  paymentTitle: { fontSize: 14, fontWeight: 'bold', color: '#111' },
  paymentDesc: { fontSize: 12, color: '#666', marginTop: 2 },
  tagAvailable: { backgroundColor: '#eafbf1', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  tagAvailableText: { fontSize: 10, fontWeight: 'bold', color: '#00a651' },
  hitsSection: { marginTop: 24, paddingHorizontal: 16 },
  hitsTitle: { fontSize: 20, fontWeight: '600', color: '#111', marginBottom: 16 },
  horizontalScrollContainer: { gap: 12, paddingBottom: 8 },
  productCard: { width: 160, backgroundColor: '#fff', borderRadius: 16 },
  productImageWrapper: { width: '100%', height: 160, backgroundColor: '#f6f6f8', borderRadius: 16, overflow: 'hidden' },
  productImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  productDetailsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  productName: { fontSize: 13, color: '#333', marginTop: 4, height: 36, fontWeight: '500' },
  blueCartBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#005bff', justifyContent: 'center', alignItems: 'center' },
  floatingFooterPill: { position: 'absolute', bottom: 90, left: 20, right: 20, backgroundColor: '#171d31', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 16, elevation: 10 },
  pillPriceBox: { flex: 1 },
  pillPrice: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  checkoutBtnWrapper: { position: 'relative' },
  checkoutBtn: { backgroundColor: '#005bff', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 12 },
  checkoutBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  coinBadge: { position: 'absolute', top: -10, right: -8, backgroundColor: '#fff', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderWidth: 2, borderColor: '#f2b80b' },
  coinText: { fontSize: 11, fontWeight: 'bold', color: '#111' },

  /* Modal BottomSheet styles */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: 350 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', textAlign: 'center', marginBottom: 16 },
  pickerScrollView: { maxHeight: 200 },
  pickerOption: { paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  pickerOptionSelected: { backgroundColor: '#f0f4ff' },
  pickerOptionText: { fontSize: 16, color: '#666' },
  pickerOptionTextSelected: { fontSize: 18, fontWeight: 'bold', color: '#005bff' },
  modalSaveBtn: { backgroundColor: '#005bff', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  modalSaveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});