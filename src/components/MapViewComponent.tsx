import React, {
  forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState,
} from 'react';
import { Alert, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

interface Point {
  id?: string | number;
  name?: string;
  latitude: number | string;
  longitude: number | string;
}

interface Props {
  latitude: number;
  longitude: number;
  zoom?: number;
  points?: Point[];
  selectedId?: string | number;
  onSelect?: (point: any) => void;
  badgeText?: string; // nhãn xanh lá dưới ghim, truyền '' để ẩn
  style?: StyleProp<ViewStyle>;
  bottomInset?: number;
}

// Màn hình gọi hàm này qua ref
export interface MapViewHandle {
  goToMyLocation: () => Promise<void>;
}

const HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
  <style>
    html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; }
    .leaflet-container { font-family: -apple-system, Roboto, sans-serif; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: false }).setView([56.4977, 84.9744], 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    var userMarker = null;

    // Vòng tròn gộp ghim: nền trắng, viền xanh, số xanh
    var cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 50,
      iconCreateFunction: function (c) {
        return L.divIcon({
          className: '',
          iconSize: [44, 44],
          iconAnchor: [22, 22],
          html:
            '<div style="width:44px;height:44px;box-sizing:border-box;border-radius:50%;' +
            'background:#fff;border:2px solid #005bff;color:#005bff;font:bold 18px sans-serif;' +
            'display:flex;align-items:center;justify-content:center;' +
            'box-shadow:0 2px 8px rgba(0,0,0,.25);">' + c.getChildCount() + '</div>'
        });
      }
    });
    map.addLayer(cluster);

    var BOX_SVG =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">' +
      '<path d="M4 3h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm5 8v2h6v-2H9z"/></svg>';

    function pinHtml(selected, badge) {
      var d = selected ? 52 : 44;
      var color = selected ? '#003cc5' : '#005bff';
      var h =
        '<div style="position:relative;width:' + d + 'px;height:' + (d + 12) + 'px;">' +
          // mũi nhọn
          '<div style="position:absolute;left:50%;top:' + (d - 4) + 'px;width:12px;height:12px;' +
            'background:' + color + ';transform:translateX(-50%) rotate(45deg);"></div>' +
          // vòng tròn
          '<div style="position:absolute;left:0;top:0;width:' + d + 'px;height:' + d + 'px;' +
            'box-sizing:border-box;border-radius:50%;background:' + color + ';border:3px solid #fff;' +
            'box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;' +
            'justify-content:center;padding-bottom:6px;">' + BOX_SVG + '</div>';
      if (badge) {
        // nhãn xanh lá đè lên đáy vòng tròn
        h +=
          '<div style="position:absolute;left:50%;top:' + (d - 20) + 'px;transform:translateX(-50%);' +
            'background:#00a651;color:#fff;font:bold 10px sans-serif;line-height:1;padding:3px 6px;' +
            'border-radius:7px;border:1.5px solid #fff;white-space:nowrap;">' + badge + '</div>';
      }
      return h + '</div>';
    }

    window.setPoints = function (points, selectedId, badge) {
      cluster.clearLayers();
      points.forEach(function (p) {
        var selected = p.id === selectedId;
        var d = selected ? 52 : 44;
        var icon = L.divIcon({
          className: '',
          html: pinHtml(selected, badge),
          iconSize: [d, d + 12],
          iconAnchor: [d / 2, d + 10]
        });
        var m = L.marker([p.lat, p.lng], { icon: icon, zIndexOffset: selected ? 1000 : 0 });
        m.on('click', function () {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'select', id: p.id }));
        });
        cluster.addLayer(m);
      });
    };

    window.setUserLocation = function (lat, lng) {
      if (userMarker) map.removeLayer(userMarker);
      userMarker = L.circleMarker([lat, lng], {
        radius: 9, color: '#fff', weight: 3, fillColor: '#1a73e8', fillOpacity: 1
      }).addTo(map);
    };

window.flyTo = function (lat, lng, zoom, inset) {
  var z = zoom || map.getZoom();
  var pt = map.project([lat, lng], z).add([0, (inset || 0) / 2]);
  map.flyTo(map.unproject(pt, z), z, { duration: 0.5 });
};

    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
  </script>
</body>
</html>
`;

export const MapViewComponent = forwardRef<MapViewHandle, Props>(
  ({ latitude, longitude, zoom = 15, points = [], selectedId, onSelect, badgeText = '1 из 1', bottomInset = 0, style }, ref) => {
    const webRef = useRef<WebView>(null);
    const [ready, setReady] = useState(false);

    const run = (js: string) => webRef.current?.injectJavaScript(js + ';true;');

    const pts = useMemo(
      () =>
        points
          .map((p, i) => ({
            id: p.id ?? i,
            name: p.name,
            lat: Number(p.latitude),
            lng: Number(p.longitude),
          }))
          .filter(p => !isNaN(p.lat) && !isNaN(p.lng)),
      [points]
    );

    // Nút "vị trí của tôi"
    useImperativeHandle(
      ref,
      () => ({
        goToMyLocation: async () => {
          if (!ready) return;
          try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Chưa có quyền', 'Hãy cho phép ứng dụng truy cập vị trí.');
              return;
            }
            const pos = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            const { latitude: la, longitude: lo } = pos.coords;
            run(`window.setUserLocation(${la}, ${lo}); window.flyTo(${la}, ${lo}, 16, ${bottomInset});`);
          } catch (e) {
            Alert.alert('Lỗi', 'Không lấy được vị trí hiện tại.');
          }
        },
      }),
      [ready, bottomInset]
    );

    // Vẽ ghim
    useEffect(() => {
      if (!ready) return;
      run(
        `window.setPoints(${JSON.stringify(pts)}, ${JSON.stringify(selectedId ?? null)}, ${JSON.stringify(badgeText)});`
      );
    }, [ready, pts, selectedId, badgeText]);

    // Bay tới điểm đang chọn
    useEffect(() => {
      if (!ready) return;
      run(`window.flyTo(${latitude}, ${longitude}, ${zoom}, ${bottomInset});`);
    }, [ready, latitude, longitude, zoom, bottomInset]);

    const handleMessage = (e: any) => {
      try {
        const msg = JSON.parse(e.nativeEvent.data);
        if (msg.type === 'ready') setReady(true);
        if (msg.type === 'select') {
          const found = points.find((p, i) => (p.id ?? i) === msg.id);
          if (found) onSelect?.(found);
        }
      } catch {}
    };

    return (
      <View style={[styles.container, style]}>
        <WebView
          ref={webRef}
          originWhitelist={['*']}
          source={{ html: HTML, baseUrl: 'https://localhost' }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          mixedContentMode="always"
          onMessage={handleMessage}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: { overflow: 'hidden', backgroundColor: '#e8eaed', flex: 1 },
  webview: { flex: 1, backgroundColor: 'transparent' },
});