import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
  ActivityIndicator, Animated, PanResponder, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { pickupPointController } from '../controllers/pickupController';
import { useCart } from '../hooks/useCart';
import { MapViewComponent, MapViewHandle } from '../components/MapViewComponent';
import { PickupPoint } from '../models';

const COLLAPSED_VISIBLE = 380; // Chiều cao của bottom sheet khi thu gọn
const EXPANDED_RATIO = 0.85;

export default function MapPickerScreen({ navigation }: { navigation: any }) {
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [areaHeight, setAreaHeight] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const { items: cartItems } = useCart(); // Lấy danh sách sản phẩm trong giỏ
  const mapRef = useRef<MapViewHandle>(null);
  const translateY = useRef(new Animated.Value(0)).current;
  const currentY = useRef(0);
  const startY = useRef(0);
  const expandedRef = useRef(false);
  const collapsedYRef = useRef(0);

  const sheetHeight = areaHeight * EXPANDED_RATIO;
  const collapsedY = Math.max(sheetHeight - COLLAPSED_VISIBLE, 0);
  collapsedYRef.current = collapsedY;

  useEffect(() => {
    pickupPointController.getAll().then(data => {
      setPickupPoints(data || []);
      if (data && data.length > 0) setSelectedPoint(data[0]);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const id = translateY.addListener(({ value }) => { currentY.current = value; });
    return () => translateY.removeListener(id);
  }, []);

  useEffect(() => {
    translateY.setValue(expandedRef.current ? 0 : collapsedY);
  }, [collapsedY]);

  const snapTo = (expand: boolean) => {
    expandedRef.current = expand;
    setExpanded(expand);
    Animated.spring(translateY, {
      toValue: expand ? 0 : collapsedYRef.current,
      useNativeDriver: true,
      bounciness: 0,
      speed: 14,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, g) => {
        if (Math.abs(g.dy) < 6 || Math.abs(g.dy) < Math.abs(g.dx)) return false;
        if (!expandedRef.current) return true;
        return g.dy > 0;
      },
      onPanResponderGrant: () => { startY.current = currentY.current; },
      onPanResponderMove: (_, g) => {
        const next = Math.min(Math.max(startY.current + g.dy, 0), collapsedYRef.current);
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const pos = startY.current + g.dy;
        if (g.vy < -0.5) snapTo(true);
        else if (g.vy > 0.5) snapTo(false);
        else snapTo(pos < collapsedYRef.current / 2);
      },
    })
  ).current;

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const lat = Number(selectedPoint?.latitude) || 56.4977;
  const lng = Number(selectedPoint?.longitude) || 84.9744;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#111" />
        </TouchableOpacity>
        <View style={styles.toggleContainer}>
          <TouchableOpacity style={[styles.toggleBtn, styles.toggleBtnActive]}>
            <Text style={styles.toggleTextActive}>Самовывоз</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleBtn}>
            <Text style={styles.toggleText}>Доставка</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.filterIcon}>
          <Ionicons name="options-outline" size={24} color="#111" />
          <View style={styles.filterBadge}><Text style={styles.filterBadgeText}>1</Text></View>
        </TouchableOpacity>
      </View>

      {/* VÙNG BẢN ĐỒ + SHEET */}
      <View style={styles.area} onLayout={e => setAreaHeight(e.nativeEvent.layout.height)}>
        <MapViewComponent
          ref={mapRef}
          latitude={lat}
          longitude={lng}
          zoom={15}
          points={pickupPoints}
          selectedId={selectedPoint?.id}
          onSelect={setSelectedPoint}
          style={StyleSheet.absoluteFill}
        />

        {/* NÚT VỊ TRÍ CỦA TÔI */}
        <TouchableOpacity 
          style={[styles.myLocationBtn, { bottom: areaHeight - collapsedY + 20 }]} 
          onPress={() => mapRef.current?.goToMyLocation()}
        >
          <Ionicons name="navigate" size={24} color="#111" />
        </TouchableOpacity>

        {/* BOTTOM SHEET (KÉO THẢ) */}
        {areaHeight > 0 && (
          <Animated.View
            style={[styles.sheet, { height: sheetHeight, transform: [{ translateY }] }]}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity activeOpacity={1} style={styles.handleZone} onPress={() => snapTo(!expanded)}>
              <View style={styles.dragHandle} />
            </TouchableOpacity>

            <View style={styles.sheetContent}>
              {/* Tên cửa hàng & Phí */}
              <View style={styles.rowBetween}>
                <View style={styles.storeTitleRow}>
                  <View style={styles.storeIconBadge}>
                    <Ionicons name="cube" size={16} color="#fff" />
                  </View>
                  <Text style={styles.storeName}>{selectedPoint?.name || 'Пункт выдачи'}</Text>
                </View>
                <Text style={styles.pickupFee}>{selectedPoint?.pickupFee || 0} ₽</Text>
              </View>

              {/* Dòng chữ "Подробнее о пункте" */}
              <TouchableOpacity style={styles.detailsRow}>
                <Ionicons name="home" size={18} color="#005bff" />
                <Text style={styles.detailsText}>Подробнее о пункте</Text>
                <Ionicons name="chevron-down" size={18} color="#666" style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>

              {/* Ngày giao hàng */}
              <Text style={styles.deliveryDate}>Привезем 21 - 22 сентября</Text>

              {/* Cảnh báo đặt cọc */}
              <View style={styles.prepaidRow}>
                <Ionicons name="alert-circle" size={20} color="#f59e0b" />
                <Text style={styles.prepaidText}>Предоплата 100%</Text>
                <Ionicons name="information-circle-outline" size={20} color="#ccc" style={{ marginLeft: 'auto' }} />
              </View>

              {/* Danh sách sản phẩm (Ảnh) */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
                {cartItems.map((item: any, index: number) => (
                  <View key={index} style={styles.productThumb}>
                    <Image source={{ uri: item.imageUrl }} style={styles.thumbImage} />
                    <View style={styles.qtyBadge}>
                      <Text style={styles.qtyBadgeText}>{item.quantity} шт</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <Text style={styles.storageText}>Срок хранения 7 дней</Text>

              {/* Nút xác nhận */}
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => navigation.navigate('Checkout', { selectedPoint })}
              >
                <Text style={styles.confirmBtnText}>Заберу отсюда</Text>
              </TouchableOpacity>

              {/* Footer text */}
              <View style={styles.sheetFooterRow}>
                <View style={styles.sheetFooterItem}>
                  <Ionicons name="cube-outline" size={16} color="#888" />
                  <Text style={styles.sheetFooterText}>Частичный выкуп</Text>
                </View>
                <View style={styles.sheetFooterItem}>
                  <Ionicons name="card-outline" size={16} color="#888" />
                  <Text style={styles.sheetFooterText}>Оплата при получении</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, zIndex: 10, backgroundColor: '#fff' },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#f6f6f8', borderRadius: 24, padding: 4, width: 240 },
  toggleBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 20 },
  toggleBtnActive: { backgroundColor: '#fff', elevation: 2 },
  toggleText: { fontSize: 14, color: '#666' },
  toggleTextActive: { fontSize: 14, fontWeight: 'bold', color: '#111' },
  filterIcon: { position: 'relative' },
  filterBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#005bff', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  filterBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  area: { flex: 1, backgroundColor: '#e8eaed', overflow: 'hidden' },
  myLocationBtn: { position: 'absolute', right: 16, backgroundColor: '#fff', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 5 },

  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 20 },
  handleZone: { paddingTop: 10, paddingBottom: 14, alignItems: 'center' },
  dragHandle: { width: 40, height: 4, backgroundColor: '#e0e0e0', borderRadius: 2 },
  
  sheetContent: { paddingHorizontal: 16, paddingBottom: 30 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  storeTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  storeIconBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#005bff', justifyContent: 'center', alignItems: 'center' },
  storeName: { fontSize: 16, fontWeight: '600', color: '#111' },
  pickupFee: { fontSize: 15, color: '#888' },

  detailsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 8 },
  detailsText: { fontSize: 15, color: '#111' },
  deliveryDate: { fontSize: 16, fontWeight: '600', color: '#111', marginTop: 16 },
  
  prepaidRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8fa', padding: 12, borderRadius: 12, marginTop: 12, gap: 8 },
  prepaidText: { fontSize: 14, fontWeight: '500', color: '#111' },
  
  productThumb: { width: 70, height: 90, backgroundColor: '#f6f6f8', borderRadius: 12, marginRight: 12, overflow: 'hidden' },
  thumbImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  qtyBadge: { position: 'absolute', bottom: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  qtyBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  storageText: { fontSize: 14, color: '#666', marginTop: 12 },

  confirmBtn: { backgroundColor: '#005bff', height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  sheetFooterRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingHorizontal: 8 },
  sheetFooterItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sheetFooterText: { fontSize: 12, color: '#888' },
});