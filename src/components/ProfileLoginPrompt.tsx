import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export const ProfileLoginPrompt = ({ onLoginPress }: { onLoginPress: () => void }) => {
  return (
    <View style={styles.container}>
      {/* Nút VK ID */}
      <TouchableOpacity style={[styles.btn, styles.vkBtn]} onPress={onLoginPress}>
        <FontAwesome5 name="vk" size={24} color="#005bff" style={styles.btnIcon} />
        <Text style={[styles.btnText, { color: '#fff' }]}>Войти с VK ID</Text>
      </TouchableOpacity>

      {/* Nút Số điện thoại -> Sẽ gọi hàm onLoginPress */}
      <TouchableOpacity style={styles.btn} onPress={onLoginPress}>
        <Ionicons name="call" size={20} color="#111" style={styles.btnIcon} />
        <Text style={styles.btnText}>По email</Text>
      </TouchableOpacity>

      {/* Nút Sber ID */}
      <TouchableOpacity style={styles.btn} onPress={onLoginPress}>
        <MaterialCommunityIcons name="check-decagram" size={22} color="#00a651" style={styles.btnIcon} />
        <Text style={styles.btnText}>Войти по Сбер ID</Text>
      </TouchableOpacity>

      {/* Nút Apple */}
      <TouchableOpacity style={styles.btn} onPress={onLoginPress}>
        <FontAwesome5 name="apple" size={22} color="#111" style={styles.btnIcon} />
        <Text style={styles.btnText}>Войти через Apple</Text>
      </TouchableOpacity>

      {/* Tiện ích */}
      <View style={styles.linksContainer}>
        <TouchableOpacity style={styles.linkItem}>
          <MaterialCommunityIcons name="scale-balance" size={24} color="#005bff" />
          <Text style={styles.linkText}>Список сравнения</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem}>
          <Ionicons name="mail-outline" size={24} color="#005bff" />
          <Text style={styles.linkText}>Стать продавцом</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem}>
          <Ionicons name="information-circle-outline" size={24} color="#005bff" />
          <Text style={styles.linkText}>Информация</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 54, borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0', marginBottom: 12, backgroundColor: '#fff' },
  vkBtn: { backgroundColor: '#005bff', borderColor: '#005bff' },
  btnIcon: { marginRight: 10 },
  btnText: { fontSize: 16, fontWeight: '600', color: '#111' },
  linksContainer: { marginTop: 30, gap: 24 },
  linkItem: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  linkText: { fontSize: 18, fontWeight: '500', color: '#111' },
});