import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export const CartEmptyState = ({ onStartShopping }: { onStartShopping: () => void }) => (
  <View style={styles.container}>
    <Image source={require('../../constants/cart_image.png')} style={styles.image} resizeMode="contain" />
    <Text style={styles.title}>Вы пока не добавили товары</Text>
    <TouchableOpacity style={styles.btn} onPress={onStartShopping}>
      <Text style={styles.btnText}>Начать покупки</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingHorizontal: 24, marginTop: 30 },
  image: { width: 240, height: 180, marginVertical: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111', marginVertical: 16, textAlign: 'center' },
  btn: { backgroundColor: '#005bff', paddingHorizontal: 32, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});