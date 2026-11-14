import React from 'react';
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  promoCode: string;
  setPromoCode: (text: string) => void;
  useBonus: boolean;
  setUseBonus: (val: boolean) => void;
  totalPrice: number;
  bonusEarned: number;
}

export const CartSummary = ({ promoCode, setPromoCode, useBonus, setUseBonus, totalPrice, bonusEarned }: Props) => (
  <View style={{ marginTop: 16 }}>
    <View style={styles.promoBox}>
      <TextInput
        placeholder="Введите промокод"
        placeholderTextColor="#888"
        style={styles.promoInput}
        value={promoCode}
        onChangeText={setPromoCode}
      />
    </View>

    <View style={styles.bonusToggle}>
      <Text style={styles.bonusTitle}>Списать бонусов</Text>
      <Switch
        trackColor={{ false: '#d0d0d0', true: '#005bff' }}
        thumbColor={'#fff'}
        disabled={totalPrice === 0}
        onValueChange={() => setUseBonus(!useBonus)}
        value={useBonus && totalPrice > 0}
      />
    </View>

    {totalPrice === 0 && (
      <View style={styles.warningBox}>
        <Ionicons name="information-circle-outline" size={14} color="#f5a623" />
        <Text style={styles.warningText}>Для этого заказа нельзя списать бонусы</Text>
      </View>
    )}

    <View style={styles.summaryCard}>
      <View style={styles.row}>
        <Text style={styles.label}>Товаров</Text>
        <Text style={styles.value}>{totalPrice.toLocaleString()} ₽</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Итого</Text>
        <Text style={styles.value}>{totalPrice.toLocaleString()} ₽</Text>
      </View>

      {totalPrice > 0 && (
        <View style={styles.cashbackRow}>
          <Text style={styles.cashbackText}>Бонусы за покупку</Text>
          <View style={styles.cashbackBadge}>
            <Text style={{ fontSize: 11 }}>🟡</Text>
            <Text style={styles.cashbackBadgeText}>+{bonusEarned}</Text>
          </View>
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  promoBox: { backgroundColor: '#f6f6f8', borderRadius: 12, paddingHorizontal: 16, height: 48, justifyContent: 'center', marginBottom: 12 },
  promoInput: { fontSize: 14, color: '#111' },
  bonusToggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f6f6f8', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16 },
  bonusTitle: { fontSize: 15, fontWeight: 'bold', color: '#111' },
  warningBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fffbe6', padding: 10, borderRadius: 8, marginTop: 8, gap: 6 },
  warningText: { fontSize: 12, color: '#d9822b' },
  summaryCard: { backgroundColor: '#f6f6f8', borderRadius: 16, padding: 16, marginVertical: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontSize: 14, color: '#666' },
  value: { fontSize: 14, fontWeight: '600', color: '#111' },
  cashbackRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  cashbackText: { fontSize: 13, color: '#666' },
  cashbackBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, gap: 4 },
  cashbackBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#111' },
});