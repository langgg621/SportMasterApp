import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const FilterSection = ({ title, data, selectedList, onSelect, renderIcon }: any) => {
  if (!data || data.length === 0) return null;
  return (
    <View style={styles.sectionPadding}>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity><Text style={styles.allLink}>Все</Text></TouchableOpacity>
      </View>
      <View style={styles.chipWrapContainer}>
        {data.map((item: any) => {
          const isPrimitive = typeof item === 'string' || typeof item === 'number';
          const value = isPrimitive
            ? String(item)
            : String(item.codeValue ?? item.CodeValue ?? item.id ?? item.ColorID ?? item.BrandID );
          const label = isPrimitive
            ? String(item)
            : String(item.description ??  item.name ??  item.colorName  ?? '');

          const active = selectedList.includes(value);

          return (
            <TouchableOpacity
              key={value}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onSelect(value)}
            >
              {renderIcon && renderIcon(item)}
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
              {active && <Ionicons name="close" size={14} color="#005bff" style={{ marginLeft: 4 }} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionPadding: { paddingHorizontal: 16, paddingTop: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  allLink: { fontSize: 14, color: '#888', fontWeight: '500' },
  chipWrapContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f6f8', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#eee', marginBottom: 4 },
  chipActive: { backgroundColor: '#eef3ff', borderColor: '#005bff' },
  chipText: { fontSize: 14, color: '#333' },
  chipTextActive: { color: '#005bff', fontWeight: 'bold' },
});