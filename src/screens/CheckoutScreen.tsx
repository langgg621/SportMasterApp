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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { cartController } from '../controllers/cartController';
import { userController } from '../controllers/userController';
import { orderController } from '../controllers/orderController';

const PICKUP_POINT_ADDRESS = 'Томск, улица Мусы Джалиля, Дом 59';
const PICKUP_FEE = 290; // Phí điểm nhận hàng (4 759 + 290 = 5 049)
const DELIVERY_DATE_TEXT = 'Привезем 21 - 22 сентября';

// Toạ độ điểm nhận hàng (Томск, ул. Мусы Джалиля 59)
const MAP_LAT = 56.4846;
const MAP_LNG = 84.9476;

// Tự render bản đồ bằng Leaflet (tải từ cdnjs) để WebView không bị trắng như trang embed của OSM
const MAP_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
  <style>
    html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: false }).setView([${MAP_LAT}, ${MAP_LNG}], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);
  </script>
</body>
</html>
`;

/**
 * 3 TRẠNG THÁI CỦA MÀN HÌNH:
 *  1. Chưa chọn địa điểm  -> selectedPickupPoint === null && mapModalVisible === false
 *  2. Đang chọn địa điểm  -> mapModalVisible === true (Modal bản đồ)
 *  3. Đã chọn xong        -> selectedPickupPoint !== null
 */
export default function CheckoutScreen({ navigation }: { navigation: any }) {
  const [cartState, setCartState] = useState<any>({ items: [] });
  const [userInfo, setUserInfo] = useState<any>({ name: '', phone: '', email: '' });
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentType, setPaymentType] = useState<'online' | 'cash'>('online');

  const [selectedPickupPoint, setSelectedPickupPoint] = useState<string | null>(null);
  const [showLocationError, setShowLocationError] = useState(false);

  // Modal bản đồ
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
  const totalQty = cartItems.reduce((sum: number, item: any) => sum + (item?.quantity || 1), 0);

  const itemsAmount = cartItems.reduce((sum: number, item: any) => {
    const cleanPrice = parseInt(String(item?.product?.price || '0').replace(/[^0-9]/g, ''), 10) || 0;
    return sum + cleanPrice * (item?.quantity || 1);
  }, 0);

  // Chưa chọn điểm: chỉ tính tiền hàng. Chọn rồi: cộng phí điểm nhận.
  const totalAmount = itemsAmount + (selectedPickupPoint ? PICKUP_FEE : 0);
  const earnedBonus = Math.round(totalAmount * 0.04) || 200;

  const formatPrice = (value: number) => `${value.toLocaleString('ru-RU')} ₽`;

  const handleProceedCheckout = () => {
    if (!selectedPickupPoint) {
      setShowLocationError(true);
      return;
    }
    setShowLocationError(false);

    try {
      const createdOrder = orderController.placeOrder({
        deliveryMethod: deliveryType,
        shippingMethodId: 'standard',
        pickupAddress: selectedPickupPoint,
        paymentMethod: paymentType as any,
      });

      navigation.navigate('OrderSuccessScreen', { createdOrder });
    } catch (error) {
      console.error('Lỗi tạo đơn hàng:', error);
    }
  };

  // ---------- Component dùng chung: danh sách ảnh sản phẩm (ảnh + số lượng từ giỏ hàng) ----------
  const renderProductThumbs = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
      {cartItems.map((item: any, index: number) => {
        const imageUri =
          item?.image?.[0] ||
          item?.product?.images?.[0] ||
          item?.images?.[0] ||
          'https://via.placeholder.com/150';

        return (
          <View key={item.id || index} style={styles.productThumbCard}>
            <Image source={{ uri: imageUri }} style={styles.productImage} />
            <View style={styles.qtyBadge}>
              <Text style={styles.qtyBadgeText}>{item.quantity || 1} шт</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );

  const openMap = () => {
    setMapTab(deliveryType);
    setMapModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Оформление заказа</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Контактная информация */}
        <View style={styles.sectionCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Контактная информация</Text>
            <TouchableOpacity onPress={() => Alert.alert('Изменить', 'Chỉnh sửa thông tin liên hệ')}>
              <Text style={styles.editText}>Изменить</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.contactRow, { marginTop: 14 }]}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={20} color="#005bff" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.userName}>{userInfo?.name || 'Линь Фам'}</Text>
              <Text style={styles.userSubText}>{userInfo?.phone || '+7 909 908 90 12'}</Text>
              <Text style={styles.userSubText}>{userInfo?.email || 'lpham342002@gmail.com'}</Text>
            </View>
          </View>
        </View>

        {/* 2. Способ получения */}
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
              <Text style={[styles.tabText, deliveryType === 'pickup' && styles.tabTextActive]}>Самовывоз</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, deliveryType === 'delivery' && styles.tabBtnActive]}
              onPress={() => {
                setDeliveryType('delivery');
                setShowLocationError(false);
              }}
            >
              <Text style={[styles.tabText, deliveryType === 'delivery' && styles.tabTextActive]}>Доставка</Text>
            </TouchableOpacity>
          </View>

          {!selectedPickupPoint ? (
            /* ============ TRẠNG THÁI 1: CHƯA CHỌN ĐỊA ĐIỂM ============ */
            <>
              <View style={[styles.mapPreviewBox, showLocationError && styles.mapPreviewError]}>
                <View style={styles.mapLineHorizontal} />
                <View style={styles.mapLineVertical} />
                <View style={styles.mapLineDiagonal} />

                <TouchableOpacity style={styles.selectPickupBtn} onPress={openMap}>
                  <Text style={styles.selectPickupBtnText}>
                    {deliveryType === 'pickup' ? 'Выбрать пункт самовывоза' : 'Выбрать адрес доставки'}
                  </Text>
                </TouchableOpacity>
              </View>

              {showLocationError && (
                <Text style={styles.errorText}>
                  {deliveryType === 'pickup' ? 'Выберите пункт самовывоза' : 'Выберите адрес доставки'}
                </Text>
              )}

              <Text style={styles.goodsTitle}>Товары, {totalQty} шт</Text>
              {renderProductThumbs()}

              <View style={[styles.rowBetween, styles.orderSummaryRow]}>
                <Text style={styles.summaryLabelSmall}>Сумма заказа</Text>
                <TouchableOpacity style={styles.priceRowBtn}>
                  <Text style={styles.summaryPriceTextSmall}>{formatPrice(totalAmount)}</Text>
                  <Ionicons name="chevron-down" size={16} color="#666" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* ============ TRẠNG THÁI 3: ĐÃ CHỌN XONG ============ */
            <View style={{ marginTop: 16 }}>
              <View style={styles.selectedPickupHeaderRow}>
                <View style={styles.pickupIconBadge}>
                  <Ionicons name="location" size={18} color="#005bff" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.selectedPointTitle}>Пункт выдачи заказа</Text>
                  <Text style={styles.selectedPointText}>{selectedPickupPoint}</Text>
                </View>
                <TouchableOpacity onPress={openMap}>
                  <Text style={styles.editText}>Изменить</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.deliveryDateTitle}>{DELIVERY_DATE_TEXT}</Text>

              <View style={styles.prepaidCardRow}>
                <View style={styles.prepaidDot} />
                <Text style={styles.prepaidCardText}>Предоплата 100%</Text>
                <Ionicons name="information-circle-outline" size={16} color="#aaa" style={{ marginLeft: 'auto' }} />
              </View>

              {renderProductThumbs()}

              <Text style={styles.storageDaysText}>Будем хранить 7 дней</Text>
            </View>
          )}
        </View>

        {/* 3. Способ оплаты — chỉ hiện sau khi đã chọn địa điểm */}
        {selectedPickupPoint && (
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
                <Text style={[styles.paymentOptionLabel, paymentType === 'online' && styles.paymentOptionLabelActive]}>
                  Онлайн
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentMethodOption, paymentType === 'cash' && styles.paymentMethodActive]}
                onPress={() => setPaymentType('cash')}
              >
                <Ionicons name="wallet-outline" size={20} color={paymentType === 'cash' ? '#005bff' : '#666'} />
                <Text style={[styles.paymentOptionLabel, paymentType === 'cash' && styles.paymentOptionLabelActive]}>
                  При получении
                </Text>
                <View style={styles.cashDot} />
              </TouchableOpacity>
            </ScrollView>

            <View style={[styles.rowBetween, styles.orderSummaryRow]}>
              <Text style={styles.summaryLabelSmall}>Сумма заказа</Text>
              <TouchableOpacity style={styles.priceRowBtn}>
                <Text style={styles.summaryPriceTextSmall}>{formatPrice(totalAmount)}</Text>
                <Ionicons name="chevron-down" size={16} color="#666" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footerContainer}>
        <View style={styles.footerInfoBox}>
          <Text style={styles.footerItemCountText}>
            {selectedPickupPoint ? '1 заказ' : `${totalQty} товар`}
          </Text>
          <View style={styles.footerPriceRow}>
            <Text style={styles.footerMainPrice}>{formatPrice(totalAmount)}</Text>
            <View style={styles.coinBadge}>
              <View style={styles.coinDot} />
              <Text style={styles.coinBadgeText}>{earnedBonus}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.checkoutSubmitBtn} onPress={handleProceedCheckout}>
          <Text style={styles.checkoutSubmitBtnText}>Оформить</Text>
        </TouchableOpacity>
      </View>

      {/* ============ TRẠNG THÁI 2: ĐANG CHỌN ĐỊA ĐIỂM (MODAL BẢN ĐỒ) ============ */}
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
                  <Text style={[styles.topToggleText, mapTab === 'pickup' && styles.topToggleTextActive]}>Самовывоз</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.topToggleBtn, mapTab === 'delivery' && styles.topToggleActive]}
                  onPress={() => setMapTab('delivery')}
                >
                  <Text style={[styles.topToggleText, mapTab === 'delivery' && styles.topToggleTextActive]}>Доставка</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.filterBtn}>
                <Ionicons name="options-outline" size={20} color="#111" />
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>1</Text>
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subFilterRow}>
              <TouchableOpacity
                style={[styles.chip, activeFilter === 'all' && styles.chipActive]}
                onPress={() => setActiveFilter('all')}
              >
                <Text style={[styles.chipText, activeFilter === 'all' && styles.chipTextActive]}>Все товары</Text>
                {activeFilter === 'all' && <Ionicons name="close-circle" size={16} color="#fff" style={{ marginLeft: 6 }} />}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.chip, activeFilter === '15min' && styles.chipActive]}
                onPress={() => setActiveFilter('15min')}
              >
                <Text style={[styles.chipText, activeFilter === '15min' && styles.chipTextActive]}>Через 15 минут</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.chip, activeFilter === 'shops' && styles.chipActive]}
                onPress={() => setActiveFilter('shops')}
              >
                <Text style={[styles.chipText, activeFilter === 'shops' && styles.chipTextActive]}>Магазины</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Bản đồ */}
          <View style={styles.mapContainer}>
            <WebView
              originWhitelist={['*']}
              source={{ html: MAP_HTML, baseUrl: 'https://localhost' }}
              style={styles.realMap}
              javaScriptEnabled
              domStorageEnabled
              mixedContentMode="always"
              startInLoadingState
              scrollEnabled={false}
              nestedScrollEnabled
              androidLayerType="hardware"
            />

            <View style={styles.customPinContainer} pointerEvents="none">
              <View style={styles.mapPinMarkerActive}>
                <Ionicons name="cube" size={14} color="#fff" />
                <Text style={styles.mapPinText}>1 из 1</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.myLocationBtn}>
              <Ionicons name="navigate-outline" size={20} color="#111" />
            </TouchableOpacity>
          </View>

          {/* Bottom sheet thông tin điểm nhận */}
          <View style={styles.bottomSheetCard}>
            <View style={styles.sheetHandle} />

            <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 0 }}>
            <View style={styles.searchBarBox}>
              <Ionicons name="search-outline" size={18} color="#888" style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Поиск по адресу или названию"
                placeholderTextColor="#888"
                style={styles.searchInput}
              />
            </View>

            <View style={styles.rowBetween}>
              <View style={styles.sheetTitleLeft}>
                <View style={styles.sheetBlueDot}>
                  <Ionicons name="cube" size={10} color="#fff" />
                </View>
                <Text style={styles.locationTitle}>Пункт выдачи Яндекс Маркет</Text>
              </View>
              <Text style={styles.sheetFee}>{PICKUP_FEE} ₽</Text>
            </View>

            <TouchableOpacity style={styles.detailLinkRow}>
              <Ionicons name="home" size={14} color="#005bff" />
              <Text style={styles.detailLinkText}>Подробнее о пункте</Text>
              <Ionicons name="chevron-down" size={16} color="#666" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <Text style={styles.locationSubText}>{PICKUP_POINT_ADDRESS}</Text>

            <Text style={styles.sheetDeliveryTitle}>{DELIVERY_DATE_TEXT}</Text>

            <View style={styles.prepaidCardRow}>
              <View style={styles.prepaidDot} />
              <Text style={styles.prepaidCardText}>Предоплата 100%</Text>
              <Ionicons name="information-circle-outline" size={16} color="#aaa" style={{ marginLeft: 'auto' }} />
            </View>

            {renderProductThumbs()}

            <Text style={styles.storageDaysText}>Срок хранения 7 дней</Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.selectThisPointBtn}
              onPress={() => {
                setSelectedPickupPoint(PICKUP_POINT_ADDRESS);
                setDeliveryType(mapTab);
                setShowLocationError(false);
                setMapModalVisible(false);
              }}
            >
              <Text style={styles.selectThisPointBtnText}>Заберу отсюда</Text>
            </TouchableOpacity>

            <View style={styles.sheetFooterRow}>
              <View style={styles.sheetFooterItem}>
                <MaterialCommunityIcons name="package-variant-closed" size={14} color="#666" />
                <Text style={styles.sheetFooterText}>Частичный выкуп</Text>
              </View>
              <View style={styles.sheetFooterItem}>
                <MaterialCommunityIcons name="cash-remove" size={14} color="#666" />
                <Text style={styles.sheetFooterText}>Оплата наличными</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f8' },
  header: {
    height: 52,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  scrollContent: { paddingBottom: 110 },
  sectionCard: { backgroundColor: '#fff', marginTop: 12, paddingHorizontal: 16, paddingVertical: 18 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  editText: { fontSize: 14, color: '#005bff', fontWeight: '600' },

  contactRow: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eef3ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: { fontSize: 13, fontWeight: '700', color: '#111' },
  userSubText: { fontSize: 13, color: '#666', marginTop: 2 },

  tabContainer: { flexDirection: 'row', backgroundColor: '#f0f0f4', borderRadius: 12, padding: 4, marginTop: 16 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 14, fontWeight: '600', color: '#666' },
  tabTextActive: { color: '#111', fontWeight: '700' },

  // --- Trạng thái 1
  mapPreviewBox: {
    height: 120,
    backgroundColor: '#fffdf5',
    borderRadius: 16,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#f0edd8',
  },
  mapPreviewError: { borderColor: '#ff3b30', borderWidth: 1.5 },
  mapLineHorizontal: { position: 'absolute', top: 40, left: 0, right: 0, height: 6, backgroundColor: '#fbe2a8' },
  mapLineVertical: { position: 'absolute', left: 70, top: 0, bottom: 0, width: 6, backgroundColor: '#fbe2a8' },
  mapLineDiagonal: {
    position: 'absolute',
    right: 60,
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: '#fbe2a8',
    transform: [{ rotate: '45deg' }],
  },
  selectPickupBtn: { backgroundColor: '#eef3ff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, zIndex: 2 },
  selectPickupBtnText: { color: '#005bff', fontSize: 15, fontWeight: '700' },
  errorText: { color: '#ff3b30', fontSize: 13, fontWeight: '600', marginTop: 8 },
  goodsTitle: { fontSize: 14, fontWeight: '700', color: '#111', marginTop: 18 },

  // --- Trạng thái 3
  selectedPickupHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  pickupIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eef3ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPointTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  selectedPointText: { fontSize: 13, color: '#666', marginTop: 2 },
  deliveryDateTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginTop: 16 },
  prepaidCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8fa',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    gap: 8,
  },
  prepaidDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#f59e0b' },
  prepaidCardText: { fontSize: 13, fontWeight: '600', color: '#111' },
  storageDaysText: { fontSize: 12, color: '#666', marginTop: 8 },

  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 10,
  },
  paymentMethodActive: { borderColor: '#005bff', backgroundColor: '#fff' },
  paymentOptionLabel: { fontSize: 14, color: '#666', fontWeight: '500' },
  paymentOptionLabelActive: { color: '#111', fontWeight: '700' },
  cashDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#f59e0b' },

  // --- Ảnh sản phẩm
  productThumbCard: {
    width: 70,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f6f6f8',
    marginRight: 10,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#eee',
  },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  qtyBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  qtyBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  orderSummaryRow: { marginTop: 20 },
  summaryLabelSmall: { fontSize: 14, fontWeight: '700', color: '#111' },
  priceRowBtn: { flexDirection: 'row', alignItems: 'center' },
  summaryPriceTextSmall: { fontSize: 14, fontWeight: '700', color: '#111' },

  // --- Footer
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 84,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  footerInfoBox: { justifyContent: 'center' },
  footerItemCountText: { fontSize: 12, color: '#888' },
  footerPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  footerMainPrice: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbe6',
    borderWidth: 1,
    borderColor: '#ffe58f',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  coinDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fadb14' },
  coinBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#111' },
  checkoutSubmitBtn: { backgroundColor: '#005bff', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  checkoutSubmitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // --- Modal bản đồ
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  topHeaderContainer: { backgroundColor: '#fff', paddingTop: 8 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  closeBtn: { padding: 4 },
  topToggleRow: { flexDirection: 'row', backgroundColor: '#f0f0f4', borderRadius: 20, padding: 2 },
  topToggleBtn: { paddingHorizontal: 18, paddingVertical: 6, borderRadius: 16 },
  topToggleActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  topToggleText: { fontSize: 13, fontWeight: '600', color: '#666' },
  topToggleTextActive: { color: '#111', fontWeight: '700' },
  filterBtn: { width: 38, height: 38, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  filterBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#005bff',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  subFilterRow: { paddingHorizontal: 16, paddingBottom: 10, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  chipActive: { backgroundColor: '#005bff', borderColor: '#005bff' },
  chipText: { fontSize: 13, fontWeight: '500', color: '#333' },
  chipTextActive: { color: '#fff', fontWeight: '600' },

  mapContainer: { flex: 1, minHeight: 220, position: 'relative', backgroundColor: '#e8eaed' },
  realMap: { ...StyleSheet.absoluteFillObject },
  customPinContainer: {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -20 }],
    zIndex: 5,
  },
  mapPinMarkerActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005bff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  mapPinText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  myLocationBtn: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 10,
  },

  bottomSheetCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    maxHeight: '60%',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    marginBottom: 12,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f8',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#111' },
  sheetTitleLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  sheetBlueDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#005bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationTitle: { fontSize: 14, fontWeight: '600', color: '#111' },
  sheetFee: { fontSize: 13, color: '#888' },
  detailLinkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  detailLinkText: { fontSize: 13, color: '#111' },
  locationSubText: { fontSize: 13, color: '#666', marginTop: 8 },
  sheetDeliveryTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginTop: 14 },
  selectThisPointBtn: {
    backgroundColor: '#005bff',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  selectThisPointBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sheetFooterRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 4 },
  sheetFooterItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sheetFooterText: { fontSize: 11, color: '#666' },
});
