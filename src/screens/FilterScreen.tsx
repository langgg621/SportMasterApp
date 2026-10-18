import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';

export default function FilterScreen({ navigation }: { navigation: any }) {
  const [isDeliveryChecked, setIsDeliveryChecked] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Белый']);
  const [selectedTechs, setSelectedTechs] = useState<string[]>(['+ADD DRY (Water Repellent)']);

  const colors = [
    { id: 'c1', name: 'Белый', hex: '#fff' },
    { id: 'c2', name: 'Бежевый', hex: '#f5f0e1' },
    { id: 'c3', name: 'Розовый', hex: '#ffc0cb' },
    { id: 'c4', name: 'Серый', hex: '#808080' },
    { id: 'c5', name: 'Черный', hex: '#000' },
  ];

  const technologies = [
    '+ADD DRY (Water Repellent)',
    'Water-resistant',
    '3M',
  ];

  const toggleColor = (name: string) => {
    if (selectedColors.includes(name)) {
      setSelectedColors(selectedColors.filter(c => c !== name));
    } else {
      setSelectedColors([...selectedColors, name]);
    }
  };

  const toggleTech = (name: string) => {
    if (selectedTechs.includes(name)) {
      setSelectedTechs(selectedTechs.filter(t => t !== name));
    } else {
      setSelectedTechs([...selectedTechs, name]);
    }
  };

  const handleReset = () => {
    setSelectedColors([]);
    setSelectedTechs([]);
    setIsDeliveryChecked(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Фильтр</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>Сбросить</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Selected Chips Active Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeChipsRow}>
          {selectedColors.map(c => (
            <View key={c} style={styles.activeChip}>
              <Text style={styles.activeChipText}>{c}</Text>
              <TouchableOpacity onPress={() => toggleColor(c)}><Text style={styles.chipClose}> ✕</Text></TouchableOpacity>
            </View>
          ))}
          {selectedTechs.map(t => (
            <View key={t} style={styles.activeChip}>
              <Text style={styles.activeChipText}>{t}</Text>
              <TouchableOpacity onPress={() => toggleTech(t)}><Text style={styles.chipClose}> ✕</Text></TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Доставка */}
        <View style={styles.sectionRow}>
          <View>
            <Text style={styles.sectionTitle}>Доставка</Text>
            <Text style={styles.subAddress}>Томск, Буяновский переулок, 3А</Text>
          </View>
          <Switch
            value={isDeliveryChecked}
            onValueChange={setIsDeliveryChecked}
            trackColor={{ false: '#d1d1d6', true: '#005bff' }}
          />
        </View>

        <View style={styles.divider} />

        {/* Самовывоз */}
        <TouchableOpacity style={styles.navRow}>
          <Text style={styles.sectionTitle}>Самовывоз</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Цвет */}
        <Text style={styles.groupTitle}>Цвет</Text>
        <View style={styles.chipGrid}>
          {colors.map(col => {
            const isSelected = selectedColors.includes(col.name);
            return (
              <TouchableOpacity
                key={col.id}
                style={[styles.filterChip, isSelected && styles.selectedFilterChip]}
                onPress={() => toggleColor(col.name)}
              >
                <View style={[styles.colorDot, { backgroundColor: col.hex, borderWidth: col.name === 'Белый' ? 1 : 0, borderColor: '#ccc' }]} />
                <Text style={[styles.filterChipText, isSelected && styles.selectedFilterChipText]}>{col.name}</Text>
                {isSelected && <Text style={styles.chipRemoveX}> ✕</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.divider} />

        {/* Технологии */}
        <Text style={styles.groupTitle}>Технологии</Text>
        <View style={styles.chipGrid}>
          {technologies.map(tech => {
            const isSelected = selectedTechs.includes(tech);
            return (
              <TouchableOpacity
                key={tech}
                style={[styles.filterChip, isSelected && styles.selectedFilterChip]}
                onPress={() => toggleTech(tech)}
              >
                <Text style={[styles.filterChipText, isSelected && styles.selectedFilterChipText]}>{tech}</Text>
                {isSelected && <Text style={styles.chipRemoveX}> ✕</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.applyBtnText}>Показать 1 товар</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  closeIcon: { fontSize: 18, color: '#333' },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#111' },
  resetText: { fontSize: 14, color: '#666' },
  body: { padding: 16 },
  activeChipsRow: { flexDirection: 'row', marginBottom: 16 },
  activeChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#005bff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8 },
  activeChipText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  chipClose: { color: '#fff', fontSize: 12 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  subAddress: { fontSize: 12, color: '#005bff', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 14 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  chevron: { fontSize: 20, color: '#888' },
  groupTitle: { fontSize: 16, fontWeight: 'bold', color: '#111', marginBottom: 10 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  filterChip: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, marginBottom: 8 },
  selectedFilterChip: { backgroundColor: '#005bff', borderColor: '#005bff' },
  filterChipText: { fontSize: 13, color: '#333' },
  selectedFilterChipText: { color: '#fff' },
  colorDot: { width: 14, height: 14, borderRadius: 7, marginRight: 6 },
  chipRemoveX: { color: '#fff', fontSize: 11 },
  footer: { padding: 16, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  applyBtn: { backgroundColor: '#005bff', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  applyBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});