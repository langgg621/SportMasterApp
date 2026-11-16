import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
  ActivityIndicator, Animated, PanResponder, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { pickupPointController } from '../controllers/pickupController';
import { MapViewComponent, MapViewHandle } from '../components/MapViewComponent';

const COLLAPSED_VISIBLE = 330; // chiều cao sheet nhìn thấy khi thu gọn
const EXPANDED_RATIO = 0.85;   // sheet mở rộng chiếm 85% vùng bản đồ
const keyOf = (p: any) => p?.id ?? p?._id;

export default function MapPickerScreen({ navigation }: { navigation: any }) {
  const [pickupPoints, setPickupPoints] = useState<any[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [areaHeight, setAreaHeight] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const mapRef = useRef<MapViewHandle>(null);
  const listRef = useRef<FlatList>(null);
  const translateY = useRef(new Animated.Value(0)).current;
  const currentY = useRef(0);
  const startY = useRef(0);
  const scrollY = useRef(0);
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

  // Theo dõi vị trí hiện tại của sheet
  useEffect(() => {
    const id = translateY.addListener(({ value }) => { currentY.current = value; });
    return () => translateY.removeListener(id);
  }, []);

  // Khi biết chiều cao vùng bản đồ thì đặt sheet đúng vị trí
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
    if (!expand) listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Chọn điểm khác (chạm ghim / chạm thẻ) -> thu gọn sheet
  useEffect(() => {
    if (selectedPoint) snapTo(false);
  }, [keyOf(selectedPoint)]);

  const panResponder = useRef(
    PanResponder.create({
      // Bắt cử chỉ kéo dọc trước khi FlatList kịp xử lý
      onMoveShouldSetPanResponderCapture: (_, g) => {
        if (Math.abs(g.dy) < 6 || Math.abs(g.dy) < Math.abs(g.dx)) return false;
        if (!expandedRef.current) return true;          // thu gọn: kéo ở đâu cũng được
        return g.dy > 0 && scrollY.current <= 0;        // mở rộng: chỉ kéo xuống khi list ở đầu
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
      onPanResponderTerminate: () => snapTo(expandedRef.current),
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  // Điểm đang chọn luôn nằm đầu danh sách
  const listData = useMemo(() => {
    if (!selectedPoint) return pickupPoints;
    return [selectedPoint, ...pickupPoints.filter(p => keyOf(p) !== keyOf(selectedPoint))];
  }, [pickupPoints, selectedPoint]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const lat = Number(selectedPoint?.latitude ?? selectedPoint?.lat) || 56.4977;
  const lng = Number(selectedPoint?.longitude ?? selectedPoint?.lng ?? selectedPoint?.lon) || 84.9744;

    // Tìm đến hàm renderItem trong MapPickerScreen.tsx
    const renderItem = ({ item }: { item: any }) => (
      // Xóa onPress ở đây đi, chỉ để style
      <View style={styles.card}> 
        <TouchableOpacity activeOpacity={0.9} onPress={() => setSelectedPoint(item)}>
          <Text style={styles.storeName}>{item.name || 'Спортмастер Томск'}</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Сегодня — <Text style={{ color: '#00a651', fontWeight: 'bold' }}>все товары</Text></Text>
          </View>
          <View style={styles.pickupInfo}>
            <Ionicons name="time-outline" size={20} color="#005bff" />
            <Text style={styles.pickupTime}>Сервисный сбор 100 ₽ • Забрать можно через 2 часа</Text>
          </View>
          {!!item.address && (
            <View style={styles.pickupInfo}>
              <Ionicons name="location-outline" size={20} color="#888" />
              <Text style={styles.addressText}>{item.address}</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.confirmBtn}
            // TRUYỀN DỮ LIỆU QUA ROUTE PARAMS
            onPress={() => navigation.navigate('Checkout', { selectedPoint: item })}
          >
            <Text style={styles.confirmBtnText}>Заберу отсюда</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailBtn}>
            <Text style={styles.detailBtnText}>Подробнее</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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

      {/* CHIP LỌC */}
      <View style={{ height: 50 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
          <TouchableOpacity style={[styles.chip, styles.chipActive]}>
            <Text style={styles.chipTextActive}>Все товары</Text>
            <Ionicons name="close-circle" size={16} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>Через 15 минут</Text></TouchableOpacity>
          <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>Магазины</Text></TouchableOpacity>
        </ScrollView>
      </View>

      {/* VÙNG BẢN ĐỒ + SHEET */}
      <View style={styles.area} onLayout={e => setAreaHeight(e.nativeEvent.layout.height)}>
        <MapViewComponent
          ref={mapRef}
          latitude={lat}
          longitude={lng}
          zoom={15}
          points={pickupPoints}
          selectedId={keyOf(selectedPoint)}
          onSelect={setSelectedPoint}
          bottomInset={COLLAPSED_VISIBLE}
          style={StyleSheet.absoluteFill}
        />

        {/* Nút vị trí: đi theo sheet, mờ dần khi mở rộng */}
        {areaHeight > 0 && (
          <Animated.View
            style={[
              styles.myLocationWrap,
              {
                top: areaHeight - sheetHeight - 66,
                opacity: translateY.interpolate({
                  inputRange: [0, Math.max(collapsedY, 1)],
                  outputRange: [0, 1],
                  extrapolate: 'clamp',
                }),
                transform: [{ translateY }],
              },
            ]}
            pointerEvents={expanded ? 'none' : 'auto'}
          >
            <TouchableOpacity style={styles.myLocationBtn} onPress={() => mapRef.current?.goToMyLocation()}>
              <Ionicons name="navigate" size={24} color="#111" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* BOTTOM SHEET KÉO ĐƯỢC */}
        {areaHeight > 0 && (
          <Animated.View
            style={[styles.sheet, { height: sheetHeight, transform: [{ translateY }] }]}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity activeOpacity={1} style={styles.handleZone} onPress={() => snapTo(!expanded)}>
              <View style={styles.dragHandle} />
            </TouchableOpacity>

            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={20} color="#888" />
              <TextInput placeholder="Поиск" placeholderTextColor="#888" style={styles.searchInput} />
            </View>

            <FlatList
              ref={listRef}
              data={listData}
              keyExtractor={(item, i) => String(keyOf(item) ?? i)}
              renderItem={renderItem}
              scrollEnabled={expanded}
              onScroll={e => { scrollY.current = e.nativeEvent.contentOffset.y; }}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#f6f6f8', borderRadius: 24, padding: 4, width: 240 },
  toggleBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 20 },
  toggleBtnActive: { backgroundColor: '#fff', elevation: 2 },
  toggleText: { fontSize: 14, color: '#666' },
  toggleTextActive: { fontSize: 14, fontWeight: 'bold', color: '#111' },
  filterIcon: { position: 'relative' },
  filterBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#005bff', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  filterBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  chipContainer: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0',
    paddingHorizontal: 16, height: 40, borderRadius: 20,
  },
  chipActive: { backgroundColor: '#005bff', borderColor: '#005bff' },
  chipText: { fontSize: 14, color: '#333' },
  chipTextActive: { fontSize: 14, color: '#fff', fontWeight: '500' },

  area: { flex: 1, backgroundColor: '#e8eaed', overflow: 'hidden' },

  myLocationWrap: { position: 'absolute', right: 16 },
  myLocationBtn: { backgroundColor: '#fff', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5 },

  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 16, elevation: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
  },
  handleZone: { paddingTop: 10, paddingBottom: 14, alignItems: 'center' },
  dragHandle: { width: 40, height: 4, backgroundColor: '#e0e0e0', borderRadius: 2 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f6f8', borderRadius: 12, paddingHorizontal: 12, height: 48, marginBottom: 8 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },

  card: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
  storeName: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00a651', marginRight: 8 },
  statusText: { fontSize: 14, color: '#333' },
  pickupInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  pickupTime: { fontSize: 14, color: '#005bff', flex: 1 },
  addressText: { fontSize: 14, color: '#666', flex: 1 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  confirmBtn: { flex: 1, backgroundColor: '#005bff', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  detailBtn: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  detailBtnText: { color: '#111', fontSize: 15 },
});