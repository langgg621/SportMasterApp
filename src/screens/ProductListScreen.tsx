import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function ProductListScreen({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Список товаров (Product List)</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#111' },
});