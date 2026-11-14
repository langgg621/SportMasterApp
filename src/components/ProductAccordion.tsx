import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../models';

interface Props {
  product: Product;
  specs: any[];
}

export const ProductAccordion = ({ product, specs }: Props) => {
  const [expanded, setExpanded] = useState({ description: true, characteristics: true });

  return (
    <View>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.header} onPress={() => setExpanded(p => ({ ...p, description: !p.description }))}>
        <Text style={styles.title}>Описание</Text>
        <Ionicons name={expanded.description ? "chevron-up" : "chevron-down"} size={20} />
      </TouchableOpacity>
      {expanded.description && <Text style={styles.bodyText}>{product.description}</Text>}

      <View style={styles.divider} />
      <TouchableOpacity style={styles.header} onPress={() => setExpanded(p => ({ ...p, characteristics: !p.characteristics }))}>
        <Text style={styles.title}>Характеристики</Text>
        <Ionicons name={expanded.characteristics ? "chevron-up" : "chevron-down"} size={20} />
      </TouchableOpacity>
      
      {expanded.characteristics && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>Артикул: {product.sku || product.id}</Text>
          
          {specs.map((spec, idx) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.charLabel}>{spec.label}</Text>
              <Text style={styles.charValue}>{spec.value}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '600', color: '#111' },
  bodyText: { fontSize: 16, color: '#444', lineHeight: 24, marginTop: 10 },
  label: { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 0.5, borderColor: '#f0f0f0' },
  charLabel: { fontSize: 15, color: '#666' },
  charValue: { fontSize: 15, fontWeight: '600', color: '#111' },
});