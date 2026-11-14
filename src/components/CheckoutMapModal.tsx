import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet,  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { PickupPoint } from '../models';
import { SafeAreaView } from 'react-native-safe-area-context';
const buildMapHtml = (lat: number, lng: number) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
  <style> html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; } </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: false }).setView([${lat || 56.4977}, ${lng || 84.9744}], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    L.marker([${lat || 56.4977}, ${lng || 84.9744}]).addTo(map);
  </script>
</body>
</html>
`;

interface Props {
  visible: boolean;
  point: PickupPoint | null;
  onClose: () => void;
  onSelect: (point: PickupPoint) => void;
}

export const CheckoutMapModal = ({ visible, point, onClose, onSelect }: Props) => {
  if (!point) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} /></TouchableOpacity>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Выбор пункта</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.mapContainer}>
          <WebView source={{ html: buildMapHtml(Number(point.latitude), Number(point.longitude)) }} style={StyleSheet.absoluteFill} />
        </View>

        <View style={styles.bottomSheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{point.name}</Text>
          <Text style={styles.subtitle}>{point.address}</Text>
          <TouchableOpacity style={styles.btn} onPress={() => onSelect(point)}>
            <Text style={styles.btnText}>Заберу отсюда</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  mapContainer: { flex: 1, minHeight: 300 },
  bottomSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, elevation: 20, marginTop: -20 },
  handle: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: '#ddd', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  btn: { backgroundColor: '#005bff', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});