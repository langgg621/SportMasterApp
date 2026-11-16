import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { orderController } from '../controllers/orderController';
import { systemKeyController } from '../controllers/systemKeyController';
import { useCountdown } from '../hooks/useCountdown';
import { OrderConfirmation } from '../models/order';
import { SystemKey } from '../models/systemKey';

export default function OrderSuccessScreen({ navigation, route }: { navigation: any; route: any }) {
  const orderId = route?.params?.orderId;

  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false); // Trạng thái đang thanh toán
  
  // State cho phương thức thanh toán
  const [paymentMethods, setPaymentMethods] = useState<SystemKey[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('');

  // Lấy dữ liệu đơn hàng và danh sách thanh toán
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderData, paymentData] = await Promise.all([
          orderController.getConfirmation(orderId),
          systemKeyController.getByParentID(10) // 10 = PAYMENT_TYPE
        ]);
        setOrder(orderData);
        setPaymentMethods(paymentData || []);
        if (paymentData && paymentData.length > 0) setSelectedPaymentId(paymentData[0].codeKey);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orderId]);

  const { hours, minutes, seconds } = useCountdown(order?.payBefore);

  // HÀM XỬ LÝ THANH TOÁN
  const handlePayment = async () => {
    setPaying(true);
    try {
      // Giả lập delay 1.5s cho giống gọi API ngân hàng
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Cập nhật trạng thái đơn hàng thành 2 (В пути - Đã thanh toán)
      await orderController.updateOrderStatus(orderId, 2);
      
      // Load lại thông tin đơn hàng để cập nhật trạng thái mới
      const updatedOrder = await orderController.getConfirmation(orderId);
      setOrder(updatedOrder);
      
      Alert.alert('Успешно', 'Заказ успешно оплачен!');
    } catch (error: any) {
      Alert.alert('Ошибка', 'Не удалось оплатить заказ');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  if (!order) return <Text style={{ textAlign: 'center', marginTop: 40 }}>Заказ не найден</Text>;

  const items = order.items || [];
  const totalItemsCount = items.reduce((sum, item) => sum + (item?.quantity || 1), 0);
  
  // Kiểm tra xem đơn hàng đã thanh toán chưa (Status = 1 là chưa thanh toán)
  const isPendingPayment = order.status === 1;

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

        {/* CHỈ HIỂN THỊ KHỐI THANH TOÁN NẾU TRẠNG THÁI LÀ 1 (CHỜ THANH TOÁN) */}
        {isPendingPayment ? (
          <>
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
                {paymentMethods.map((method) => {
                  const isSelected = selectedPaymentId === method.codeKey;
                  const color = isSelected ? '#005bff' : '#111';
                  const isCash = method.codeKey === 'PAYMENT_TYPE_CASH';
                  return (
                    <TouchableOpacity
                      key={method.id}
                      style={[styles.paymentCard, isSelected && styles.paymentCardActive]}
                      onPress={() => setSelectedPaymentId(method.codeKey)}
                    >
                      <Ionicons name={isCash ? 'cash-outline' : 'card-outline'} size={18} color={color} />
                      <Text style={[styles.paymentLogoText, { color }]}>{method.description}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <TouchableOpacity
                style={styles.payButton}
                onPress={handlePayment}
                disabled={paying}
              >
                {paying ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.payButtonText}>Оплатить</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.payButton, { backgroundColor: '#eef3ff', marginTop: 20 }]}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Text style={[styles.payButtonText, { color: '#005bff' }]}>Вернуться на главную</Text>
          </TouchableOpacity>
        )}

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

// ... (Giữ nguyên styles cũ của bạn)
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