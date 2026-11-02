import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface NoInternetScreenProps {
  onRefresh?: () => void;
}

export default function NoInternetScreen({ onRefresh }: NoInternetScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
<View style={styles.iconContainer}>
          <Ionicons name="compass-outline" size={90} color="#005bff" />
        </View>

        {/* Tiêu đề & Thông báo */}
        <Text style={styles.titleText}>Что-то пошло не так</Text>
        <Text style={styles.subtitleText}>Попробуйте обновить страницу</Text>

        {/* Nút Thử lại (Обновить) */}
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Text style={styles.refreshBtnText}>Обновить</Text>
        </TouchableOpacity>
      </View>

      {/* Banner thông báo VPN màu tối bên dưới */}
      <View style={styles.vpnBannerWrapper}>
        <View style={styles.vpnBanner}>
          <Text style={styles.vpnBannerText}>
            Кажется, включен VPN. Отключите его — он замедляет работу приложения
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: -40, // Đẩy nhẹ nội dung lên trung tâm màn hình
  },
  compassImage: {
    width: 220,
    height: 220,
    marginBottom: 28,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshBtn: {
    backgroundColor: '#005bff', // Màu xanh đặc trưng của ứng dụng
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
  },
  refreshBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  /* Style cho banner thông báo VPN */
  vpnBannerWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  vpnBanner: {
    backgroundColor: '#1c2230', // Nền màu xám đen đậm
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  vpnBannerText: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    textAlign: 'left',
  },
});