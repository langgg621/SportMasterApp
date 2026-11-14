import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

export const CheckoutCartThumbs = ({ cartItems }: { cartItems: any[] }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
      {cartItems.map((item: any, index: number) => (
        <View key={item.id || index} style={styles.productThumbCard}>
          <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
          <View style={styles.qtyBadge}>
            <Text style={styles.qtyBadgeText}>{item.quantity || 1} шт</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  productThumbCard: { width: 70, height: 80, borderRadius: 12, backgroundColor: '#f6f6f8', marginRight: 10, overflow: 'hidden', position: 'relative' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  qtyBadge: { position: 'absolute', bottom: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4 },
  qtyBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});