import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { cartController } from '../controllers/cartController';
import { userController } from '../controllers/userController';
import { orderController } from '../controllers/orderController';

export default function CheckoutScreen({ navigation }: { navigation: any }) {
  const [cartState, setCartState] = useState<any>({ items: [] });
  const [userInfo, setUserInfo] = useState<any>({ name: '', phone: '', email: '' });
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentType, setPaymentType] = useState<'online' | 'cash'>('online');
  
  // State quản lý điểm nhận hàng (ban đầu null = chưa chọn)
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<string | null>(null);
  const [showLocationError, setShowLocationError] = useState(false);

  // State Modal bản đồ
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [mapTab, setMapTab] = useState<'pickup' | 'delivery'>('pickup');
  const [activeFilter, setActiveFilter] = useState('all');

  const loadCheckoutData = useCallback(() => {
    try {
      const currentCart = cartController.getCartState();
      setCartState(currentCart || { items: [] });

      const currentUser = userController.getUserProfile();
      setUserInfo(currentUser);
    } catch (e) {
      setCartState({ items: [] });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCheckoutData();
    }, [loadCheckoutData])
  );

  const cartItems = cartState?.items || [];
  const totalItemsCount = cartItems.reduce((sum: number, item: any) => sum + (item?.quantity || 1), 0);
  
  const totalAmount = cartItems.reduce((sum: number, item: any) => {
    const cleanPrice = parseInt(String(item?.product?.price || '0').replace(/[^0-9]/g, ''), 10) || 0;
    return sum + cleanPrice * (item?.quantity || 1);
  }, 0);

  const earnedBonus = Math.round(totalAmount * 0.04) || 200;

  // Xử lý khi bấm nút Đặt hàng "Оформить"
  const handleProceedCheckout = () => {
    if (deliveryType === 'pickup' && !selectedPickupPoint) {
      setShowLocationError(true);
      return;
    }
    setShowLocationError(false);
    
    try {
      // Gọi orderController để tạo đơn hàng mới từ giỏ hàng và địa điểm đã chọn
      const createdOrder = orderController.placeOrder({
        deliveryMethod: deliveryType,
        shippingMethodId: 'standard',
        pickupAddress: selectedPickupPoint || 'Томск, улица Мусы Джалиля, Дом 59',
        paymentMethod: paymentType as any,
      });

      navigation.navigate('OrderSuccessScreen', {
        orderId: createdOrder.orderNumber,
        pickupPoint: createdOrder.pickupAddress,
        totalAmount: createdOrder.total,
        cartItems: createdOrder.items,
        orderStatus: 'Создан',
      });

      // Chuyển sang màn hình thành công với dữ liệu nhận từ controller
      navigation.navigate('OrderSuccessScreen', {
        createdOrder
      });
    } catch (error) {
      console.error("Lỗi tạo đơn hàng:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Оформление заказа</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. SECTION: Контактная информация */}
        <View style={styles.sectionCard}>
          <View style={styles.contactRow}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={20} color="#005bff" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.userName}>{userInfo.name || 'Линь Фам'}</Text>
              <Text style={styles.userSubText}>{userInfo.phone || '+7 909 908 90 12'}</Text>
              <Text style={styles.userSubText}>{userInfo.email || 'lpham342002@gmail.com'}</Text>
            </View>
          </View>
        </View>

        {/* 2. SECTION: Способ получения */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Способ получения</Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabBtn, deliveryType === 'pickup' && styles.tabBtnActive]}
              onPress={() => {
                setDeliveryType('pickup');
                setShowLocationError(false);
              }}
            >
              <Text style={[styles.tabText, deliveryType === 'pickup' && styles.tabTextActive]}>
                Самовывоз
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, deliveryType === 'delivery' && styles.tabBtnActive]}
              onPress={() => {
                setDeliveryType('delivery');
                setShowLocationError(false);
              }}
            >
              <Text style={[styles.tabText, deliveryType === 'delivery' && styles.tabTextActive]}>
                Доставка
              </Text>
            </TouchableOpacity>
          </View>

          {/* CẤU TRÚC ĐIỀU KIỆN (CONDITIONAL RENDERING):
              1. CHƯA CHỌN ĐỊA ĐIỂM -> Hiện khung bản đồ xem trước & Nút "Выбрать пункт самовывоза"
              2. ĐÃ CHỌN ĐỊA ĐIỂM -> Hiện chi tiết thông tin địa chỉ, ngày giao, ảnh sản phẩm & số ngày lưu trữ
          */}
          {!selectedPickupPoint ? (
            <View style={[styles.mapPreviewBox, showLocationError && styles.mapPreviewError]}>
              <View style={styles.mapLineHorizontal} />
              <View style={styles.mapLineVertical} />
              <View style={styles.mapLineDiagonal} />

              <TouchableOpacity 
                style={styles.selectPickupBtn}
                onPress={() => setMapModalVisible(true)}
              >
                <Text style={styles.selectPickupBtnText}>Выбрать пункт самовывоза</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ marginTop: 16 }}>
              {/* Địa điểm đã chọn + Nút Изменить */}
              <View style={styles.selectedPickupHeaderRow}>
                <View style={styles.pickupIconBadge}>
                  <Ionicons name="location" size={18} color="#005bff" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.selectedPointTitle}>Пункт выдачи заказа</Text>
                  <Text style={styles.selectedPointText}>{selectedPickupPoint}</Text>
                </View>
                <TouchableOpacity onPress={() => setMapModalVisible(true)}>
                  <Text style={styles.editText}>Изменить</Text>
                </TouchableOpacity>
              </View>

              {/* Chi tiết thời gian & trả trước */}
              <Text style={styles.deliveryDateTitle}>Привезем 21 - 22 сентября</Text>
              
              <View style={styles.prepaidCardRow}>
                <Text style={{ fontSize: 13 }}>🍊</Text>
                <Text style={styles.prepaidCardText}>Предоплата 100%</Text>
                <Ionicons name="information-circle-outline" size={16} color="#aaa" style={{ marginLeft: 'auto' }} />
              </View>

              {/* Danh sách hình ảnh sản phẩm */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
                {cartItems.map((item: any, index: number) => (
                  <View key={item.id || index} style={styles.productThumbCard}>
                    <Image source={{ uri: item?.product?.images?.[0] }} style={styles.productImage} />
                    <View style={styles.qtyBadge}>
                      <Text style={styles.qtyBadgeText}>{item.quantity || 1} шт</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              
              {/* Dòng chữ lưu trữ */}
              <Text style={styles.storageDaysText}>Будем хранить 7 дней</Text>
            </View>
          )}

          {showLocationError && !selectedPickupPoint && (
            <Text style={styles.errorText}>Выберите пункт самовывоза</Text>
          )}
        </View>

        {/* 3. SECTION: Способ оплаты */}
        <View style={styles.sectionCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Способ оплаты</Text>
            <TouchableOpacity>
              <Text style={styles.editText}>Все</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
            <TouchableOpacity 
              style={[styles.paymentMethodOption, paymentType === 'online' && styles.paymentMethodActive]}
              onPress={() => setPaymentType('online')}
            >
              <Ionicons name="card-outline" size={20} color={paymentType === 'online' ? '#005bff' : '#666'} />
              <Text style={[styles.paymentOptionLabel, paymentType === 'online' && styles.paymentOptionLabelActive]}>Онлайн</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.paymentMethodOption, paymentType === 'cash' && styles.paymentMethodActive]}
              onPress={() => setPaymentType('cash')}
            >
              <Ionicons name="wallet-outline" size={20} color={paymentType === 'cash' ? '#005bff' : '#666'} />
              <Text style={[styles.paymentOptionLabel, paymentType === 'cash' && styles.paymentOptionLabelActive]}>При получении</Text>
              <Text style={{ fontSize: 10, color: '#f59e0b' }}>🟧</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Tổng tiền đơn hàng */}
          <View style={[styles.rowBetween, styles.orderSummaryRow]}>
            <Text style={styles.summaryLabel}>Сумма заказа</Text>
            <TouchableOpacity style={styles.priceRowBtn}>
              <Text style={styles.summaryPriceText}>{totalAmount.toLocaleString()} ₽</Text>
              <Ionicons name="chevron-down" size={18} color="#111" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 4. FLOATING FOOTER */}
      <View style={styles.footerContainer}>
        <View style={styles.footerInfoBox}>
          <Text style={styles.footerItemCountText}>1 заказ</Text>
          <View style={styles.footerPriceRow}>
            <Text style={styles.footerMainPrice}>{totalAmount.toLocaleString()} ₽</Text>
            <View style={styles.coinBadge}>
              <Text style={{ fontSize: 11 }}>🟡</Text>
              <Text style={styles.coinBadgeText}>{earnedBonus}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.checkoutSubmitBtn} 
          onPress={handleProceedCheckout}
        >
          <Text style={styles.checkoutSubmitBtnText}>Оформить</Text>
        </TouchableOpacity>
      </View>

      {/* --- MODAL BẢN ĐỒ CHỌN ĐIỂM NHẬN --- */}
      <Modal visible={mapModalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
          <View style={styles.topHeaderContainer}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => setMapModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#111" />
              </TouchableOpacity>

              <View style={styles.topToggleRow}>
                <TouchableOpacity 
                  style={[styles.topToggleBtn, mapTab === 'pickup' && styles.topToggleActive]}
                  onPress={() => setMapTab('pickup')}
                >
                  <Text style={[styles.topToggleText, mapTab === 'pickup' && styles.topToggleTextActive]}>
                    Самовывоз
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.topToggleBtn, mapTab === 'delivery' && styles.topToggleActive]}
                  onPress={() => setMapTab('delivery')}
                >
                  <Text style={[styles.topToggleText, mapTab === 'delivery' && styles.topToggleTextActive]}>
                    Доставка
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.filterBtn}>
                <Ionicons name="options-outline" size={20} color="#005bff" />
                <View style={styles.filterBadge}><Text style={styles.filterBadgeText}>1</Text></View>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subFilterRow}>
              <TouchableOpacity 
                style={[styles.chip, activeFilter === 'all' && styles.chipActive]}
                onPress={() => setActiveFilter('all')}
              >
                <Text style={[styles.chipText, activeFilter === 'all' && styles.chipTextActive]}>Все товары</Text>
                {activeFilter === 'all' && <Ionicons name="close-circle" size={14} color="#005bff" style={{ marginLeft: 4 }} />}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.chip, activeFilter === 'shops' && styles.chipActive]}
                onPress={() => setActiveFilter('shops')}
              >
                <Text style={[styles.chipText, activeFilter === 'shops' && styles.chipTextActive]}>Магазины</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.chip, activeFilter === 'fitting' && styles.chipActive]}
                onPress={() => setActiveFilter('fitting')}
              >
                <Text style={[styles.chipText, activeFilter === 'fitting' && styles.chipTextActive]}>Примерка</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.mapContainer}>
            <MapView
              style={styles.realMap}
              initialRegion={{
                latitude: 56.4846,
                longitude: 84.9476,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{ latitude: 56.4846, longitude: 84.9476 }}
                title="Томск, улица Мусы Джалиля, Дом 59"
              >
                <View style={styles.mapPinMarker}>
                  <View style={styles.pinIconBox}>
                    <Ionicons name="cube" size={14} color="#fff" />
                  </View>
                  <Text style={styles.pinMarkerText}>1 из 1</Text>
                </View>
              </Marker>
            </MapView>

            <TouchableOpacity style={styles.myLocationBtn}>
              <Ionicons name="navigate-outline" size={20} color="#111" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSheetCard}>
            <View style={styles.searchBarBox}>
              <Ionicons name="search-outline" size={18} color="#888" style={{ marginRight: 8 }} />
              <TextInput 
                placeholder="Поиск по адресу или названию" 
                placeholderTextColor="#888"
                style={styles.searchInput}
              />
            </View>

            <View style={styles.locationInfoSection}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <View style={styles.locationIconBox}>
                  <MaterialCommunityIcons name="shopping-outline" size={20} color="#005bff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationTitle}>Пункт выдачи заказа</Text>
                  <Text style={styles.locationSubText}>Томск, улица Мусы Джалиля, Дом 59</Text>
                  
                  <View style={styles.locationDetailRow}>
                    <Ionicons name="time-outline" size={14} color="#00a651" />
                    <Text style={styles.locationTimeText}>Привезем 21 - 22 сентября</Text>
                  </View>
                </View>
              </View>

              {/* Nút xác nhận địa điểm từ Modal -> cập nhật selectedPickupPoint */}
              <TouchableOpacity 
                style={styles.selectThisPointBtn} 
                onPress={() => {
                  setSelectedPickupPoint('Томск, улица Мусы Джалиля, Дом 59');
                  setShowLocationError(false);
                  setMapModalVisible(false);
                }}
              >
                <Text style={styles.selectThisPointBtnText}>Заберу отсюда</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f8' },
  header: { height: 52, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  scrollContent: { paddingBottom: 110 },
  sectionCard: { backgroundColor: '#fff', marginTop: 12, paddingHorizontal: 16, paddingVertical: 18 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  editText: { fontSize: 14, color: '#005bff', fontWeight: '600' },
  contactRow: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#eef3ff', justifyContent: 'center', alignItems: 'center' },
  userName: { fontSize: 16, fontWeight: '700', color: '#111' },
  userSubText: { fontSize: 13, color: '#666', marginTop: 2 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#f0f0f4', borderRadius: 12, padding: 4, marginTop: 16 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#666' },
  tabTextActive: { color: '#111', fontWeight: '700' },

  selectedPickupHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  pickupIconBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#eef3ff', justifyContent: 'center', alignItems: 'center' },
  selectedPointTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  selectedPointText: { fontSize: 13, color: '#666', marginTop: 2 },
  deliveryDateTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginTop: 16 },
  prepaidCardRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8fa', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, marginTop: 10, gap: 8 },
  prepaidCardText: { fontSize: 13, fontWeight: '600', color: '#111' },
  storageDaysText: { fontSize: 12, color: '#666', marginTop: 8 },

  paymentMethodOption: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#eee', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, marginRight: 10 },
  paymentMethodActive: { borderColor: '#005bff', backgroundColor: '#fff' },
  paymentOptionLabel: { fontSize: 14, color: '#666', fontWeight: '500' },
  paymentOptionLabelActive: { color: '#111', fontWeight: '700' },

  mapPreviewBox: { height: 120, backgroundColor: '#fffdf5', borderRadius: 16, marginTop: 16, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: '#f0edd8' },
  mapPreviewError: { borderColor: '#ff3b30', borderWidth: 1.5 },
  mapLineHorizontal: { position: 'absolute', top: 40, left: 0, right: 0, height: 6, backgroundColor: '#fbe2a8' },
  mapLineVertical: { position: 'absolute', left: 70, top: 0, bottom: 0, width: 6, backgroundColor: '#fbe2a8' },
  mapLineDiagonal: { position: 'absolute', right: 60, top: 0, bottom: 0, width: 8, backgroundColor: '#fbe2a8', transform: [{ rotate: '45deg' }] },
  selectPickupBtn: { backgroundColor: '#eef3ff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, zIndex: 2 },
  selectPickupBtnText: { color: '#005bff', fontSize: 15, fontWeight: '700' },
  errorText: { color: '#ff3b30', fontSize: 13, fontWeight: '600', marginTop: 8 },
  productThumbCard: { width: 70, height: 80, borderRadius: 12, backgroundColor: '#f6f6f8', marginRight: 10, overflow: 'hidden', position: 'relative' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  qtyBadge: { position: 'absolute', bottom: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4 },
  qtyBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  orderSummaryRow: { marginTop: 20, paddingTop: 16 },
  summaryLabel: { fontSize: 16, fontWeight: '700', color: '#111' },
  priceRowBtn: { flexDirection: 'row', alignItems: 'center' },
  summaryPriceText: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 84, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  footerInfoBox: { justifyContent: 'center' },
  footerItemCountText: { fontSize: 12, color: '#888' },
  footerPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  footerMainPrice: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  coinBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fffbe6', borderWidth: 1, borderColor: '#ffe58f', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, gap: 4 },
  coinBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#111' },
  checkoutSubmitBtn: { backgroundColor: '#005bff', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  checkoutSubmitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  modalContainer: { flex: 1, backgroundColor: '#fff' },
  topHeaderContainer: { backgroundColor: '#fff', paddingTop: 8, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10 },
  closeBtn: { padding: 4 },
  topToggleRow: { flexDirection: 'row', backgroundColor: '#f0f0f4', borderRadius: 20, padding: 2 },
  topToggleBtn: { paddingHorizontal: 18, paddingVertical: 6, borderRadius: 16 },
  topToggleActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, elevation: 2 },
  topToggleText: { fontSize: 13, fontWeight: '600', color: '#666' },
  topToggleTextActive: { color: '#111', fontWeight: '700' },
  filterBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#f0f4ff', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  filterBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: '#005bff', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  filterBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  subFilterRow: { paddingHorizontal: 16, paddingBottom: 10, gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f6f8', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  chipActive: { backgroundColor: '#eef3ff', borderWidth: 1, borderColor: '#005bff' },
  chipText: { fontSize: 13, fontWeight: '500', color: '#333' },
  chipTextActive: { color: '#005bff', fontWeight: '600' },
  mapContainer: { flex: 1, position: 'relative' },
  realMap: { ...StyleSheet.absoluteFill },
  myLocationBtn: { position: 'absolute', right: 16, bottom: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, zIndex: 10 },
  mapPinMarker: { backgroundColor: '#005bff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, gap: 6, elevation: 6 },
  pinIconBox: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#0043cc', justifyContent: 'center', alignItems: 'center' },
  pinMarkerText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  bottomSheetCard: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, elevation: 20, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10 },
  searchBarBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f6f8', borderRadius: 12, paddingHorizontal: 12, height: 44, marginBottom: 14 },
  searchInput: { flex: 1, fontSize: 14, color: '#111' },
  locationInfoSection: { marginTop: 4 },
  locationIconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eef3ff', justifyContent: 'center', alignItems: 'center' },
  locationTitle: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  locationSubText: { fontSize: 13, color: '#666', marginTop: 2 },
  locationDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  locationTimeText: { fontSize: 12, color: '#00a651', fontWeight: '600' },
  selectThisPointBtn: { backgroundColor: '#005bff', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  selectThisPointBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});