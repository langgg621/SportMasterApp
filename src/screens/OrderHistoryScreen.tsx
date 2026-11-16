import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { orderController } from '../controllers/orderController';
import { Order } from '../models/order';

// Các Tab lọc trạng thái
const TABS = [
  { key: 'current', label: 'Текущие', status: undefined }, // undefined = lấy tất cả trừ Hủy/Hoàn thành
  { key: 'completed', label: 'Завершенные', status: 3 },   // 3 = Completed
  { key: 'cancelled', label: 'Отмененные', status: 4 },    // 4 = Cancelled
];

export default function OrderHistoryScreen({ navigation }: { navigation: any }) {
  const [activeTab, setActiveTab] = useState('current');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Gọi API mỗi khi đổi Tab
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Tìm status tương ứng với tab đang chọn
        const currentTab = TABS.find(t => t.key === activeTab);
        // Gọi API
        const res = await orderController.getMyOrders(currentTab?.status);
        setOrders(res.items || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab]);

  // Hàm render trạng thái (Cục màu xanh lá, xám...)
  const renderStatusBadge = (status: number) => {
    let text = '';
    let bgColor = '#f0f0f0';
    let textColor = '#666';

    if (status === 1) { text = 'Создан'; bgColor = '#eef2ff'; textColor = '#005bff'; }
    else if (status === 2) { text = 'В пути'; bgColor = '#eef2ff'; textColor = '#005bff'; }
    else if (status === 3) { text = 'Получен'; bgColor = '#e8f5e9'; textColor = '#2e7d32'; } // Màu xanh lá
    else if (status === 4) { text = 'Отменён'; bgColor = '#f5f5f5'; textColor = '#9e9e9e'; }

    return (
      <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
        <Text style={[styles.statusText, { color: textColor }]}>{text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Мои заказы</Text>
        <TouchableOpacity style={styles.chatBtn}>
          <Ionicons name="chatbubble-outline" size={24} color="#111" />
          <View style={styles.chatBadge}><Text style={styles.chatBadgeText}>5</Text></View>
        </TouchableOpacity>
      </View>

      {/* Thanh cuộn Tabs */}
      <View style={{ height: 70 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Danh sách đơn hàng */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Здесь пока пусто</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.orderCard}
              // Chuyển sang màn chi tiết đơn hàng nếu bấm vào
              onPress={() => navigation.navigate('OrderSuccessScreen', { orderId: item.id })}
            >
              {/* Dòng 1: Mã đơn + Ngày */}
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>№ {item.orderNumber}</Text>
                <Text style={styles.orderDate}>от {new Date(item.createDate).toLocaleDateString('ru-RU')}</Text>
              </View>

              {/* Dòng 2: Trạng thái (Badge) */}
              {renderStatusBadge(item.status)}

              {/* Dòng 3: Tổng tiền, Hình thức nhận, Ảnh */}
              <View style={styles.orderBody}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.orderPrice}>Сумма {item.totalAmount.toLocaleString('ru-RU')} ₽</Text>
                  <Text style={styles.orderDeliveryType}>
                    {item.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}
                  </Text>
                </View>
                <Image 
                  source={{ uri: item.firstImageUrl || 'https://via.placeholder.com/60' }} 
                  style={styles.productImg} 
                />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  chatBtn: { position: 'relative', padding: 4 },
  chatBadge: { position: 'absolute', right: -2, top: 0, width: 16, height: 16, borderRadius: 8, backgroundColor: '#f3203d', justifyContent: 'center', alignItems: 'center' },
  chatBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },

  tabsContainer: { paddingHorizontal: 16, paddingVertical: 8, gap: 10, alignItems: 'center' },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fff' },
  tabBtnActive: { borderColor: '#111', backgroundColor: '#111' },
  tabText: { fontSize: 14, color: '#333', fontWeight: '500' },
  tabTextActive: { color: '#fff' },

  orderCard: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingVertical: 16 },
  orderHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  orderNumber: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  orderDate: { fontSize: 14, color: '#888' },
  
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, marginBottom: 12 },
  statusText: { fontSize: 14, fontWeight: '500' },

  orderBody: { flexDirection: 'row', alignItems: 'center' },
  orderPrice: { fontSize: 16, color: '#111', marginBottom: 4 },
  orderDeliveryType: { fontSize: 14, color: '#333' },
  productImg: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#f6f6f8' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 18, color: '#888', marginTop: 16 },
});