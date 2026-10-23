import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { orderController } from '../controllers/orderController';
import { cartController } from '../controllers/cartController';

export default function OrderSuccessScreen({ navigation, route }: { navigation: any; route: any }) {
  // 1. Lấy dữ liệu đơn hàng từ orderController hoặc từ route.params
  const userOrders = orderController.getUserOrders ? orderController.getUserOrders() : [];
  const latestOrder = userOrders.length > 0 ? userOrders[0] : null;

  const orderId = route?.params?.orderId || latestOrder?.orderNumber || latestOrder?.id || '27016526-938196';
  const pickupPoint = route?.params?.pickupPoint || latestOrder?.pickupAddress || 'Томск, улица Мусы Джалиля, Дом 59';
  const totalAmount = route?.params?.totalAmount || latestOrder?.total || 5049;
  const cartItems = route?.params?.cartItems || latestOrder?.items || [];

  // 2. Lấy danh sách phương thức thanh toán từ cartController
  const paymentMethods = cartController.getPaymentMethod ? cartController.getPaymentMethod() : [];
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(paymentMethods[0]?.id || 'sbp');

  // Đồng hồ đếm ngược 1 tiếng (3600 giây)
  const [timeLeft, setTimeLeft] = useState(3596);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h} : ${m} : ${s}`;
  };

  const totalItemsCount = cartItems.reduce((sum: number, item: any) => sum + (item?.quantity || 1), 0);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Заказ оформлен</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Badge Trạng thái */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>Создан</Text>
        </View>

        {/* Thông tin đơn hàng động */}
        <Text style={styles.pickupDateText}>Можно получить с 21 сентября</Text>
        <Text style={styles.orderNumberText}>Заказ № {orderId}</Text>

        {/* Số lượng sản phẩm động */}
        <Text style={styles.itemCountText}>
          {totalItemsCount} {totalItemsCount === 1 ? 'товар в заказе' : 'товаров в заказе'}
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          {cartItems.length > 0 ? (
            cartItems.map((item: any, index: number) => (
              <View key={index} style={styles.productThumbCard}>
                <Image source={{ uri: item?.product?.images?.[0] }} style={styles.productImage} />
                <View style={styles.qtyBadge}>
                  <Text style={styles.qtyBadgeText}>{item.quantity || 1} шт</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.productThumbCard}>
              <Image
                source={{ uri: 'https://via.placeholder.com/100' }}
                style={styles.productImage}
              />
              <View style={styles.qtyBadge}>
                <Text style={styles.qtyBadgeText}>1 шт</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Tổng giá tiền động */}
        <Text style={styles.totalAmountText}>
          Сумма заказа: {Number(totalAmount).toLocaleString()} ₽
        </Text>

        {/* Thanh cảnh báo chờ thanh toán & đếm ngược */}
        <View style={styles.timerBanner}>
          <Text style={styles.timerBannerText}>Ждёт оплаты</Text>
          <View style={styles.timerRow}>
            <Ionicons name="time-outline" size={16} color="#fff" />
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
        </View>

        {/* Chọn Cổng thanh toán động từ cartController.getPaymentMethod() */}
        <View style={{ marginTop: 20 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Способ оплаты</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Все</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.paymentMethodsRow}>
            {paymentMethods.map((method: any) => {
              const isSelected = selectedPaymentId === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.paymentCard, isSelected && styles.paymentCardActive]}
                  onPress={() => setSelectedPaymentId(method.id)}
                >
                  {method.icon && (
                    method.isIonIcon ? (
                      <Ionicons name={method.icon} size={18} color={isSelected ? '#005bff' : '#111'} />
                    ) : (
                      <MaterialCommunityIcons name={method.icon} size={18} color={isSelected ? '#005bff' : '#111'} />
                    )
                  )}
                  <Text style={styles.paymentLogoText}>{method.title}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Nút Thanh toán chính */}
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => alert(`Переход к оплате через ${selectedPaymentId}...`)}
          >
            <Text style={styles.payButtonText}>Оплатить</Text>
          </TouchableOpacity>
        </View>

        {/* Địa điểm nhận hàng động */}
        <View style={styles.locationSection}>
          <Text style={styles.locationTitle}>Пункт выдачи Яндекс Маркет</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationAddress}>{pickupPoint}</Text>
            <TouchableOpacity style={styles.routeBtn}>
              <Ionicons name="git-compare-outline" size={18} color="#111" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  closeBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusBadgeText: { color: '#005bff', fontSize: 13, fontWeight: '600' },
  pickupDateText: { fontSize: 18, fontWeight: 'bold', color: '#111', marginTop: 14 },
  orderNumberText: { fontSize: 14, color: '#666', marginTop: 4 },
  itemCountText: { fontSize: 15, fontWeight: '600', color: '#111', marginTop: 16 },
  productThumbCard: {
    width: 80,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#f6f6f8',
    marginRight: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  qtyBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  qtyBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  totalAmountText: { fontSize: 16, fontWeight: 'bold', color: '#111', marginTop: 16 },
  timerBanner: {
    backgroundColor: '#e53935',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  timerBannerText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timerText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  linkText: { fontSize: 14, color: '#005bff', fontWeight: '600' },
  paymentMethodsRow: { marginTop: 12 },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    gap: 6,
  },
  paymentCardActive: { borderColor: '#005bff', backgroundColor: '#f0f4ff' },
  paymentLogoText: { fontSize: 14, fontWeight: 'bold', color: '#111' },
  payButton: {
    backgroundColor: '#181828',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  payButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  locationSection: { marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderColor: '#eee' },
  locationTitle: { fontSize: 15, fontWeight: 'bold', color: '#111' },
  locationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  locationAddress: { fontSize: 13, color: '#666', flex: 1, marginRight: 10 },
  routeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f6f6f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
});