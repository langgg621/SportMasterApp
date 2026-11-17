import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const CheckboxRow = ({ label, isChecked, onPress }: any) => (
  <TouchableOpacity style={styles.checkboxRow} activeOpacity={0.8} onPress={onPress}>
    <Text style={styles.checkboxLabel}>{label}</Text>
    <View style={[styles.squareCheckbox, isChecked && styles.squareCheckboxActive]}>
      {isChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  checkboxRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  checkboxLabel: { fontSize: 16, fontWeight: '500', color: '#111' },
  squareCheckbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#d1d1d6', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  squareCheckboxActive: { backgroundColor: '#005bff', borderColor: '#005bff' },
});