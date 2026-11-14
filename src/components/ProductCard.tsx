import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Product } from '../models';

interface ProductCardProps {
  item: Product;
  onPress: () => void;
  onAddToCart: () => void;
  badgeText?: string;
  badgeColor?: string;
}

export const ProductCard = ({ item, onPress, onAddToCart, badgeText, badgeColor }: ProductCardProps) => {
  return (
    <TouchableOpacity style={styles.productCard} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.productImageWrapper}>
        <Image source={{ uri: item.imageUrl }} style={styles.productImg} />
        <View style={styles.floatingActions}>
          <TouchableOpacity style={styles.actionIconBtn}>
            <Ionicons name="heart-outline" size={16} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIconBtn}>
            <MaterialCommunityIcons name="scale-unbalanced" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.productDetailsRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>{item.newPrice} ₽</Text>
            {item.discount ? <Text style={styles.productDiscount}>-{item.discount}%</Text> : null}
          </View>
          <Text style={styles.productName} numberOfLines={2}>{item.productName}</Text>
          
          {badgeText && (
            <View style={[styles.customBadge, { backgroundColor: badgeColor || '#8048e8' }]}>
              <Text style={styles.customBadgeText}>{badgeText}</Text>
            </View>
          )}

          <Text style={styles.ratingText}>
            <Text style={{ color: '#005bff' }}>★</Text> {item.avgRating || '4.9'} ({item.reviewCount || 120})
          </Text>
        </View>

        <TouchableOpacity style={styles.blueCartBtn} onPress={onAddToCart}>
          <Ionicons name="cart-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: { width: 160, backgroundColor: '#fff', borderRadius: 10 },
  productImageWrapper: { width: '100%', height: 200, backgroundColor: '#f6f6f8', borderRadius: 16, overflow: 'hidden', position: 'relative' },
  productImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  floatingActions: { position: 'absolute', top: 8, right: 8, gap: 6 },
  actionIconBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  productDetailsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  productDiscount: { fontSize: 12, color: '#ff3b30', fontWeight: 'bold' },
  productName: { fontSize: 13, color: '#333', marginTop: 4, height: 36, fontWeight: '500' },
  customBadge: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginVertical: 4 },
  customBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  ratingText: { fontSize: 12, color: '#666', marginTop: 2 },
  blueCartBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#005bff', justifyContent: 'center', alignItems: 'center' },
});