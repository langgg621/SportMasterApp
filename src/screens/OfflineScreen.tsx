import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContext } from '@react-navigation/native';
import FloatingNavBar from '../components/FloatingNavBar';
import { useFloatingNav } from '../hooks/useFloatingNav';

interface NoInternetScreenProps {
  onRefresh?: () => void;
}

export default function NoInternetScreen({ onRefresh }: NoInternetScreenProps) {
  // NavigationContext = undefined nếu màn này được render ngoài NavigationContainer (vd App.tsx khi mất mạng)
  const navigation: any = useContext(NavigationContext);
  const floatingNav = useFloatingNav(navigation);

  const handleRefresh = () => {
    if (onRefresh) onRefresh();
    else if (navigation?.canGoBack?.()) navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Ionicons name="compass-outline" size={90} color="#005bff" />

        <Text style={styles.titleText}>Что-то пошло не так</Text>
        <Text style={styles.subtitleText}>Попробуйте обновить страницу</Text>

        <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh}>
          <Text style={styles.refreshBtnText}>Обновить</Text>
        </TouchableOpacity>
      </View>

      {/* Banner VPN: đặt cao hơn thanh nav nổi để không bị che */}
      <View style={styles.vpnBannerWrapper}>
        <View style={styles.vpnBanner}>
          <Text style={styles.vpnBannerText}>
            Кажется, включен VPN. Отключите его — он замедляет работу приложения
          </Text>
        </View>
      </View>

      <FloatingNavBar activeTab="Главная" {...floatingNav} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'space-between' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, marginTop: -40 },
  titleText: { fontSize: 20, fontWeight: '700', color: '#111', textAlign: 'center', marginTop: 16, marginBottom: 8 },
  subtitleText: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 24 },
  refreshBtn: { backgroundColor: '#005bff', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', minWidth: 160 },
  refreshBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  vpnBannerWrapper: { paddingHorizontal: 16, paddingBottom: 110 },
  vpnBanner: { backgroundColor: '#1c2230', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
  vpnBannerText: { color: '#fff', fontSize: 13, lineHeight: 18, fontWeight: '400', textAlign: 'left' },
});
