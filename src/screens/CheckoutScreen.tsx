import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { pickupPointController } from '../controllers/pickupController'; 
import { orderController } from '../controllers/orderController';
import { systemKeyController } from '../controllers/systemKeyController';
import { PickupPoint, SystemKey } from '../models';

export default function CheckoutScreen({ navigation, route }: { navigation: any; route: any }) {
  const { items: cartItems, totalCount, fetchCart } = useCart();
  const { user } = useAuth();

  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  // Lưu nguyên object Phương thức thanh toán được chọn thay vì string 'online'/'cash'
  const [selectedPayment, setSelectedPayment] = useState<SystemKey | null>(null);
  const [loading, setLoading] = useState(false);

  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<PickupPoint | null>(null);

  // State lưu danh sách phương thức thanh toán lấy từ API
  const [paymentMethods, setPaymentMethods] = useState<SystemKey[]>([]);

  // 1. Gọi API lấy danh sách Phương thức thanh toán (ParentID = 10)
  useEffect(() => {
    systemKeyController.getByParentID(10)
      .then((data) => {
        setPaymentMethods(data || []);
        if (data && data.length > 0) setSelectedPayment(data[0]); // Mặc định chọn cái đầu tiên
      })
      .catch(console.error);
  }, []);

  // Lắng nghe dữ liệu trả về từ MapPicker
  useEffect(() => {
    if (route?.params?.selectedPoint) {
      setSelectedPickupPoint(route.params.selectedPoint);
    }
  }, [route?.params?.selectedPoint]);

  // Lấy danh sách điểm nhận hàng mặc định
  useEffect(() => {
    pickupPointController.getAll().then((data: any) => {
      setPickupPoints(data || []);
      if (!selectedPickupPoint && data && data.length > 0) {
        setSelectedPickupPoint(data[0]);
      }
    }).catch(console.error);
  }, []);

  const totalQty = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
  const earnedBonus = Math.floor(totalAmount * 0.05);

  const handleProceedCheckout = async () => {
    if (!selectedPickupPoint || !selectedPayment) return;
    setLoading(true);

    try {
      const order = await orderController.createOrder({
        deliveryType,
        pickupId: selectedPickupPoint.id,
        // Truyền CodeValue (VD: 'СБП' hoặc 'При получении') từ DB xuống
        paymentType: selectedPayment.codeValue || selectedPayment.description,
        shippingFee: 0,
        discountAmount: 0
      });

      await fetchCart();
      navigation.navigate('PaymentScreen', { 
        orderId: order.id, 
        totalAmount: order.totalAmount,
      });
    } catch (error: any) {
      Alert.alert('Ошибка', error.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Оформление заказа</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* 1. Контактная информация */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Контактная информация</Text>
            <TouchableOpacity><Text style={styles.editText}>Изменить</Text></TouchableOpacity>
          </View>
          <View style={styles.userInfoRow}>
            <View style={styles.avatarIcon}>
              <Ionicons name="person" size={24} color="#005bff" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.userName}>{user?.fullName || 'Гость'}</Text>
              <Text style={styles.userContact}>{user?.phone || '+7 999 000 00 00'}</Text>
              <Text style={styles.userContact}>{user?.email || 'email@test.com'}</Text>
            </View>
          </View>
        </View>

        {/* 2. Способ получения */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Способ получения</Text>
          
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleBtn, deliveryType === 'pickup' && styles.toggleBtnActive]}
              onPress={() => setDeliveryType('pickup')}
            >
              <Text style={[styles.toggleText, deliveryType === 'pickup' && styles.toggleTextActive]}>Самовывоз</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, deliveryType === 'delivery' && styles.toggleBtnActive]}
              onPress={() => setDeliveryType('delivery')}
            >
              <Text style={[styles.toggleText, deliveryType === 'delivery' && styles.toggleTextActive]}>Доставка</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.storeInfoContainer}>
            <View style={styles.storeIconBox}>
              <Ionicons name="location" size={24} color="#005bff" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.storeTitle}>Забрать в магазине</Text>
                <TouchableOpacity onPress={() => navigation.navigate('MapPicker')}>
                  <Text style={styles.editPointText}>Изменить</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.storeAddress}>{selectedPickupPoint?.address || 'Выберите пункт самовывоза'}</Text>
            </View>
          </View>

          <Text style={styles.pickupTimeTitle}>Можно получить сегодня</Text>

          <View style={styles.prepaidRow}>
            <Ionicons name="alert-circle" size={20} color="#f59e0b" />
            <Text style={styles.prepaidText}>Предоплата 100%</Text>
            <Ionicons name="information-circle-outline" size={18} color="#ccc" style={{ marginLeft: 'auto' }} />
          </View>

          <View style={{ marginTop: 16 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {cartItems.map((item, index) => (
                <View key={index} style={styles.productThumb}>
                  <Image source={{ uri: item.imageUrl }} style={styles.thumbImage} />
                  <View style={styles.qtyBadge}>
                    <Text style={styles.qtyBadgeText}>{item.quantity} шт</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <Text style={styles.storageText}>Будем хранить 7 дней</Text>
        </View>

        {/* 3. Способ оплаты - RENDER TỪ API */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Способ оплаты</Text>
            <TouchableOpacity><Text style={styles.editText}>Все</Text></TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
            {paymentMethods.map((method) => {
              const isSelected = selectedPayment?.id === method.id;
              // Xác định icon dựa vào CodeKey (nếu là CASH thì dùng icon tiền mặt)
              const isCash = method.codeKey === 'PAYMENT_TYPE_CASH';

              return (
                <TouchableOpacity 
                  key={method.id}
                  style={[styles.payCard, isSelected && styles.payCardActive]}
                  onPress={() => setSelectedPayment(method)}
                >
                  <Ionicons 
                    name={isCash ? 'cash-outline' : 'card-outline'} 
                    size={20} 
                    color={isSelected ? '#005bff' : '#666'} 
                  />
                  <Text style={[styles.payText, isSelected && styles.payTextActive]}>
                    {method.description} {/* Hiển thị chữ tiếng Nga từ DB */}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Tổng tiền */}
        <View style={styles.sectionCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Сумма заказа</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.totalValue}>{totalAmount.toLocaleString()} ₽</Text>
              <Ionicons name="chevron-down" size={16} color="#888" style={{ marginLeft: 8 }} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Thanh Toán */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerCount}>{totalQty} товар</Text>
          <View style={styles.footerPriceRow}>
            <Text style={styles.footerPrice}>{totalAmount.toLocaleString()} ₽</Text>
            <View style={styles.bonusBadge}>
              <Text style={{ fontSize: 12 }}>🟡</Text>
              <Text style={styles.bonusText}>{earnedBonus}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.submitBtn, (!selectedPickupPoint || !selectedPayment) && { backgroundColor: '#ccc' }]} 
          onPress={handleProceedCheckout} 
          disabled={loading || !selectedPickupPoint || !selectedPayment}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Оформить</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f8' },
  header: { height: 52, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  sectionCard: { backgroundColor: '#fff', marginTop: 12, padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '500', color: '#111' },
  editText: { fontSize: 15, color: '#005bff' },
  
  userInfoRow: { flexDirection: 'row', alignItems: 'center' },
  avatarIcon: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#eef3ff', justifyContent: 'center', alignItems: 'center' },
  userName: { fontSize: 18, fontWeight: '500', color: '#111' },
  userContact: { fontSize: 15, color: '#666', marginTop: 2 },
  
  toggleContainer: { flexDirection: 'row', backgroundColor: '#f6f6f8', borderRadius: 24, padding: 4, marginVertical: 16 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
  toggleBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  toggleText: { fontSize: 15, color: '#666', fontWeight: '500' },
  toggleTextActive: { color: '#111', fontWeight: 'bold' },

  storeInfoContainer: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 8 },
  storeIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#eef3ff', justifyContent: 'center', alignItems: 'center' },
  storeTitle: { fontSize: 16, fontWeight: '500', color: '#111' },
  storeAddress: { fontSize: 14, color: '#666', marginTop: 4, lineHeight: 20 },
  editPointText: { fontSize: 14, color: '#005bff', fontWeight: '500' },
  
  pickupTimeTitle: { fontSize: 18, fontWeight: '600', color: '#111', marginTop: 20, marginBottom: 12 },
  prepaidRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8fa', padding: 14, borderRadius: 12, gap: 8 },
  prepaidText: { fontSize: 15, fontWeight: '500', color: '#111' },
  
  productThumb: { width: 80, height: 100, backgroundColor: '#f6f6f8', borderRadius: 12, marginRight: 12, overflow: 'hidden' },
  thumbImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  qtyBadge: { position: 'absolute', bottom: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  qtyBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  storageText: { fontSize: 14, color: '#666', marginTop: 12 },

  payCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginRight: 12, gap: 8 },
  payCardActive: { borderColor: '#005bff', backgroundColor: '#f0f4ff' },
  payText: { fontSize: 15, fontWeight: '500', color: '#111' },
  payTextActive: { color: '#005bff' },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 18, fontWeight: '500', color: '#111' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#111' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 90, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 },
  footerCount: { fontSize: 13, color: '#888' },
  footerPriceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  footerPrice: { fontSize: 24, fontWeight: 'bold', color: '#111' },
  bonusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fffbe6', borderWidth: 1, borderColor: '#fadb14', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, gap: 4 },
  bonusText: { fontSize: 13, fontWeight: 'bold', color: '#111' },
  submitBtn: { backgroundColor: '#005bff', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 12 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});