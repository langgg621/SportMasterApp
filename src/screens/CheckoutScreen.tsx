import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { orderController } from '../controllers/orderController';
import { userController } from '../controllers/userController';

export default function CheckoutScreen({ navigation }: { navigation: any }) {
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const profile = userController.getUserProfile();
  const totals = orderController.calculateTotal('ship1', 200);

  const handlePlaceOrder = () => {
    try {
      const order = orderController.placeOrder({
        deliveryMethod: deliveryMethod,
        shippingMethodId: 'ship1',
        pickupAddress: profile.location,
        paymentMethod: 'CARD_ONLINE',
        usedBonusPoints: 200,
      });
      Alert.alert('Успешно!', `Заказ ${order.number} успешно оформлен.`, [
        { text: 'OK', onPress: () => navigation.navigate('HomeTab') }
      ]);
    } catch (e: any) {
      Alert.alert('Ошибка', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Оформление заказа</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.sectionCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Контактная информация</Text>
          </View>
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.userPhone}>+7 909 908 90 12</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Способ получения</Text>
          <View style={styles.tabToggleRow}>
            <TouchableOpacity 
              style={[styles.toggleBtn, deliveryMethod === 'pickup' && styles.activeToggle]}
              onPress={() => setDeliveryMethod('pickup')}
            >
              <Text style={[styles.toggleText, deliveryMethod === 'pickup' && styles.activeToggleText]}>Самовывоз</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, deliveryMethod === 'delivery' && styles.activeToggle]}
              onPress={() => setDeliveryMethod('delivery')}
            >
              <Text style={[styles.toggleText, deliveryMethod === 'delivery' && styles.activeToggleText]}>Доставка</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapBox}>
            <Text style={styles.mapBoxText}>{profile.location}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.summaryLabel}>Сумма заказа</Text>
            <Text style={styles.summaryValue}>{totals.subTotal} ₽</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.finalPrice}>{totals.finalTotal} ₽</Text>
        </View>
        <TouchableOpacity style={styles.orderBtn} onPress={handlePlaceOrder}>
          <Text style={styles.orderBtnText}>Оформить</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  backBtn: { fontSize: 18, marginRight: 16, fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  body: { padding: 12 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111', marginBottom: 8 },
  userName: { fontSize: 15, fontWeight: '600', color: '#333' },
  userPhone: { fontSize: 14, color: '#555', marginTop: 2 },
  tabToggleRow: { flexDirection: 'row', backgroundColor: '#f1f2f6', borderRadius: 8, padding: 4, marginBottom: 12 },
  toggleBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  activeToggle: { backgroundColor: '#fff' },
  toggleText: { fontSize: 14, color: '#666', fontWeight: '500' },
  activeToggleText: { color: '#111', fontWeight: 'bold' },
  mapBox: { backgroundColor: '#eef3ff', padding: 14, borderRadius: 8, alignItems: 'center' },
  mapBoxText: { color: '#005bff', fontSize: 14, fontWeight: '600' },
  summaryLabel: { fontSize: 15, color: '#333' },
  summaryValue: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },
  finalPrice: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  orderBtn: { backgroundColor: '#005bff', paddingVertical: 12, paddingHorizontal: 36, borderRadius: 8 },
  orderBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});