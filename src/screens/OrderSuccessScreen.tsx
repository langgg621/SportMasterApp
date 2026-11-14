import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { orderController } from '../controllers/orderController';
import { useCountdown } from '../hooks/useCountdown';
import { OrderConfirmation } from '../models/order';

// Vì Backend chưa có API lấy phương thức thanh toán, ta dùng tạm mảng tĩnh này
const PAYMENT_METHODS = [
  { id: 'sber', title: 'СБП', icon: 'card-outline', isIonIcon: true },
  { id: 'sberpay', title: 'SberPay', icon: 'wallet-outline', isIonIcon: false },
  { id: 'card', title: 'Картой', icon: 'credit-card-outline', isIonIcon: true },
];

export default function OrderSuccessScreen({ navigation, route }: { navigation: any; route: any }) {
  const orderId = route?.params?.orderId;

  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('sber');

  // Gọi API thật để lấy thông tin xác nhận đơn hàng
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderController.getConfirmation(orderId);
        setOrder(data);
      } catch (error) {
        console.error('Lỗi lấy đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Hạn thanh toán lấy từ DB (payBefore)
  const { hours, minutes, seconds } = useCountdown(order?.payBefore);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 16 }}>Заказ не найден</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={{ marginTop: 20, alignSelf: 'center' }}>
          <Text style={{ color: '#005bff', fontSize: 16 }}>Вернуться на главную</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const items = order.items || [];
  const totalItemsCount = items.reduce((sum, item) => sum + (item?.quantity || 1), 0);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Заказ оформлен</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>{order.statusText}</Text>
        </View>

        <Text style={styles.pickupDateText}>Можно получить с {order.availableFromText}</Text>
        <Text style={styles.orderNumberText}>Заказ № {order.orderNumber}</Text>

        <Text style={styles.itemCountText}>
          {totalItemsCount} {totalItemsCount === 1 ? 'товар в заказе' : 'товаров в заказе'}
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          {items.map((item: any, index: number) => (
            <View key={item.productId ?? index} style={styles.productThumbCard}>
              <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
              <View style={styles.qtyBadge}>
                <Text style={styles.qtyBadgeText}>{item.quantity || 1} шт</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.totalAmountText}>Сумма заказа: {order.totalAmount?.toLocaleString('ru-RU')} ₽</Text>

        <View style={styles.timerBanner}>
          <Text style={styles.timerBannerText}>Ждёт оплаты</Text>
          <View style={styles.timerRow}>
            <Ionicons name="time-outline" size={16} color="#fff" />
            <Text style={styles.timerText}>{`${hours} : ${minutes} : ${seconds}`}</Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Способ оплаты</Text>
            <TouchableOpacity><Text style={styles.linkText}>Все</Text></TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.paymentMethodsRow}>
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedPaymentId === method.id;
              const color = isSelected ? '#005bff' : '#111';
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.paymentCard, isSelected && styles.paymentCardActive]}
                  onPress={() => setSelectedPaymentId(method.id)}
                >
                  {method.isIonIcon ? (
                    <Ionicons name={method.icon as any} size={18} color={color} />
                  ) : (
                    <MaterialCommunityIcons name={method.icon as any} size={18} color={color} />
                  )}
                  <Text style={styles.paymentLogoText}>{method.title}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={styles.payButton}
            onPress={() => alert(`Переход к оплате через ${selectedPaymentId}...`)}
          >
            <Text style={styles.payButtonText}>Оплатить</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.locationSection}>
          <Text style={styles.locationTitle}>{order.pickupName}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationAddress}>{order.pickupAddress}</Text>
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
  header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  closeBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  statusBadge: { alignSelf: 'flex-start', backgroundColor: '#eef2ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusBadgeText: { color: '#005bff', fontSize: 13, fontWeight: '600' },
  pickupDateText: { fontSize: 18, fontWeight: 'bold', color: '#111', marginTop: 14 },
  orderNumberText: { fontSize: 14, color: '#666', marginTop: 4 },
  itemCountText: { fontSize: 15, fontWeight: '600', color: '#111', marginTop: 16 },
  productThumbCard: { width: 80, height: 90, borderRadius: 12, backgroundColor: '#f6f6f8', marginRight: 10, overflow: 'hidden', position: 'relative' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  qtyBadge: { position: 'absolute', bottom: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  qtyBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  totalAmountText: { fontSize: 16, fontWeight: 'bold', color: '#111', marginTop: 16 },
  timerBanner: { backgroundColor: '#e53935', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  timerBannerText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timerText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  linkText: { fontSize: 14, color: '#005bff', fontWeight: '600' },
  paymentMethodsRow: { marginTop: 12 },
  paymentCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#eee', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginRight: 10, gap: 6 },
  paymentCardActive: { borderColor: '#005bff', backgroundColor: '#f0f4ff' },
  paymentLogoText: { fontSize: 14, fontWeight: 'bold', color: '#111' },
  payButton: { backgroundColor: '#181828', borderRadius: 12, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 14 },
  payButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  locationSection: { marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderColor: '#eee' },
  locationTitle: { fontSize: 15, fontWeight: 'bold', color: '#111' },
  locationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  locationAddress: { fontSize: 13, color: '#666', flex: 1, marginRight: 10 },
  routeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f6f6f8', justifyContent: 'center', alignItems: 'center' },
});