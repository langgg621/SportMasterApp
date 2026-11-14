import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
  currentQty: number;
  onSelectQty: (num: number) => void;
  onClose: () => void;
  onSave: () => void;
}

export const CartQuantityModal = ({ visible, currentQty, onSelectQty, onClose, onSave }: Props) => (
  <Modal visible={visible} transparent animationType="slide">
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.content} onStartShouldSetResponder={() => true}>
        <Text style={styles.title}>Количество</Text>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <TouchableOpacity
              key={num}
              style={[styles.option, currentQty === num && styles.optionSelected]}
              onPress={() => onSelectQty(num)}
            >
              <Text style={[styles.optionText, currentQty === num && styles.optionTextSelected]}>
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveBtnText}>Сохранить</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: 350 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#111', textAlign: 'center', marginBottom: 16 },
  scroll: { maxHeight: 200 },
  option: { paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  optionSelected: { backgroundColor: '#f0f4ff' },
  optionText: { fontSize: 16, color: '#666' },
  optionTextSelected: { fontSize: 18, fontWeight: 'bold', color: '#005bff' },
  saveBtn: { backgroundColor: '#005bff', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});