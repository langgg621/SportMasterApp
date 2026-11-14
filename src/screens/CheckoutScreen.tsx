import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { pickupPointController } from '../controllers/pickupController';
import { orderController } from '../controllers/orderController';
import { PickupPoint } from '../models';

import { CheckoutMapModal } from '../components/CheckoutMapModal';
import { CheckoutCartThumbs } from '../components/CheckoutCartThumbs';

export default function CheckoutScreen({ navigation }: { navigation: any }) {
  const { items: cartItems, fetchCart } = useCart(); 
  const { user } = useAuth();
  
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentType, setPaymentType] = useState<'online' | 'cash'>('online');
  const [loading, setLoading] = useState(false);

  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [showError, setShowError] = useState(false);

  // Lấy dữ liệu điểm nhận hàng thật từ DB
  useEffect(() => {
    pickupPointController.getAll().then(data => {
      setPickupPoints(data || []);
      if (data?.length > 0) setSelectedPoint(data[0]);
    }).catch(console.error);
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
  const totalQty = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const formatPrice = (val: number) => `${val.toLocaleString('ru-RU')} ₽`;

  const handleCheckout = async () => {
    if (!selectedPoint) return setShowError(true);
    setShowError(false);
    setLoading(true);

    try {
      const order = await orderController.createOrder({
        deliveryType,
        pickupId: selectedPoint.id,
        paymentType: paymentType === 'online' ? 'СБП' : 'При получении',
        shippingFee: 0,
        discountAmount: 0
      });

      await fetchCart(); // Làm trống giỏ hàng toàn app
      navigation.navigate('OrderSuccessScreen', { orderId: order.id });
    } catch (error: any) {
      Alert.alert('Ошибка', error.message); // Báo lỗi từ API (VD: OUT_OF_STOCK)
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Оформление</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Khối User */}
        <View style={styles.card}>
          <Text style={styles.title}>Контактная информация</Text>
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{user?.fullName || 'Гость'}</Text>
            <Text style={{ color: '#666', marginTop: 4 }}>{user?.phone || '+7 (999) 000-00-00'}</Text>
          </View>
        </View>

        {/* Khối Phương thức nhận hàng */}
        <View style={styles.card}>
          <Text style={styles.title}>Способ получения</Text>
          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, deliveryType === 'pickup' && styles.tabActive]} onPress={() => setDeliveryType('pickup')}>
              <Text style={[styles.tabText, deliveryType === 'pickup' && styles.tabTextActive]}>Самовывоз</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, deliveryType === 'delivery' && styles.tabActive]} onPress={() => setDeliveryType('delivery')}>
              <Text style={[styles.tabText, deliveryType === 'delivery' && styles.tabTextActive]}>Доставка</Text>
            </TouchableOpacity>
          </View>

          {selectedPoint ? (
            <View style={{ marginTop: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Ionicons name="location" size={20} color="#005bff" />
                  <View>
                    <Text style={{ fontWeight: 'bold' }}>{selectedPoint.name}</Text>
                    <Text style={{ color: '#666', fontSize: 13 }}>{selectedPoint.address}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setMapVisible(true)}><Text style={{ color: '#005bff' }}>Изменить</Text></TouchableOpacity>
              </View>
              <CheckoutCartThumbs cartItems={cartItems} />
            </View>
          ) : (
            <TouchableOpacity style={styles.selectBtn} onPress={() => setMapVisible(true)}>
              <Text style={{ color: '#005bff', fontWeight: 'bold' }}>Выбрать пункт выдачи</Text>
            </TouchableOpacity>
          )}
          {showError && <Text style={{ color: 'red', marginTop: 8 }}>Пожалуйста, выберите пункт</Text>}
        </View>

        {/* Khối Thanh toán */}
        {selectedPoint && (
          <View style={styles.card}>
            <Text style={styles.title}>Способ оплаты</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <TouchableOpacity style={[styles.payBtn, paymentType === 'online' && styles.payBtnActive]} onPress={() => setPaymentType('online')}>
                <Ionicons name="card-outline" size={20} color={paymentType === 'online' ? '#005bff' : '#666'} />
                <Text style={paymentType === 'online' ? { color: '#005bff' } : { color: '#666' }}>Онлайн</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.payBtn, paymentType === 'cash' && styles.payBtnActive]} onPress={() => setPaymentType('cash')}>
                <Ionicons name="wallet-outline" size={20} color={paymentType === 'cash' ? '#005bff' : '#666'} />
                <Text style={paymentType === 'cash' ? { color: '#005bff' } : { color: '#666' }}>При получении</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={{ color: '#888', fontSize: 12 }}>{totalQty} товар</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{formatPrice(totalAmount)}</Text>
        </View>
        <TouchableOpacity style={styles.submitBtn} onPress={handleCheckout} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Оформить</Text>}
        </TouchableOpacity>
      </View>

      {/* Gọi Component Modal Map */}
      <CheckoutMapModal 
        visible={mapVisible} 
        point={pickupPoints[0]} 
        onClose={() => setMapVisible(false)} 
        onSelect={(p) => {
          setSelectedPoint(p);
          setMapVisible(false);
          setShowError(false);
        }} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f8' },
  header: { height: 52, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', marginTop: 12, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  tabs: { flexDirection: 'row', backgroundColor: '#f0f0f4', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#fff', elevation: 2 },
  tabText: { fontSize: 14, color: '#666', fontWeight: '600' },
  tabTextActive: { color: '#111', fontWeight: 'bold' },
  selectBtn: { marginTop: 16, padding: 16, backgroundColor: '#eef3ff', borderRadius: 12, alignItems: 'center' },
  payBtn: { flex: 1, flexDirection: 'row', gap: 8, padding: 16, borderWidth: 1, borderColor: '#eee', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  payBtnActive: { borderColor: '#005bff', backgroundColor: '#f0f4ff' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 84, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  submitBtn: { backgroundColor: '#005bff', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
});