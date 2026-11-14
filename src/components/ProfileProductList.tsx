import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ProductCard } from './ProductCard';
import { Product } from '../models';

interface Props {
  title: string;
  products: Product[];
  onProductPress: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export const ProfileProductList = ({ title, products, onProductPress, onAddToCart }: Props) => {
  if (!products || products.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {products.map((p) => (
          <ProductCard 
            key={p.id} 
            item={p} 
            onPress={() => onProductPress(p.id)}
            onAddToCart={() => onAddToCart(p)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 24, paddingHorizontal: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 16 },
  scrollContent: { gap: 12, paddingBottom: 8 },
});