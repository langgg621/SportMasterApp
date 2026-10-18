import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SizeGuideModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  // Dữ liệu bảng size chuẩn theo Sportmaster / PUMA
  const sizeData = [
    { rus: '34.5', eur: '35.5', us: '4', uk: '3', cm: '22' },
    { rus: '35', eur: '36', us: '4.5', uk: '3.5', cm: '22.5' },
    { rus: '36', eur: '37', us: '5', uk: '4', cm: '23' },
    { rus: '37', eur: '38', us: '6', uk: '5', cm: '24' },
    { rus: '38', eur: '38.5', us: '6.5', uk: '5.5', cm: '24.5' },
    { rus: '39', eur: '39', us: '7', uk: '6', cm: '25' },
    { rus: '39.5', eur: '40', us: '7.5', uk: '6.5', cm: '25.5' },
    { rus: '40', eur: '40.5', us: '8', uk: '7', cm: '26' },
    { rus: '41', eur: '41.5', us: '8.5', uk: '7.5', cm: '26.5' },
    { rus: '41.5', eur: '42.5', us: '9.5', uk: '8.5', cm: '27.5' },
    { rus: '42', eur: '43', us: '10', uk: '9', cm: '28' },
    { rus: '43', eur: '44', us: '10.5', uk: '9.5', cm: '28.5' },
    { rus: '44', eur: '45', us: '11', uk: '10', cm: '29' },
    { rus: '45', eur: '46', us: '12', uk: '11', cm: '30' },
  ];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close-outline" size={28} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Таблица размеров</Text>
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {/* Thông báo lưu ý */}
          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              Российский размер может отсутствовать на упаковке товара. Рекомендуем использовать таблицу размеров при выборе и примерять товар при получении[cite: 23].
            </Text>
          </View>

          {/* Logo PUMA */}
          <Text style={styles.brandTitle}>PUMA</Text>

          {/* KHU VỰC BẢNG SIZE: CỘT TRÁI CỐ ĐỊNH + CỘT PHẢI CUỘN NGANG */}
          <View style={styles.tableCard}>
            
            {/* Cột xanh bên trái cố định */}
            <View style={styles.fixedColumn}>
              <View style={styles.fixedCell}><Text style={styles.fixedLabelText}>RUS</Text></View>
              <View style={styles.fixedCell}><Text style={styles.fixedLabelText}>EUR</Text></View>
              <View style={styles.fixedCell}><Text style={styles.fixedLabelText}>US</Text></View>
              <View style={styles.fixedCell}><Text style={styles.fixedLabelText}>UK</Text></View>
              <View style={[styles.fixedCell, styles.lastCell]}>
                <Text style={styles.fixedLabelText}>Длина{'\n'}стопы, см</Text>
              </View>
            </View>

            {/* Các cột số bên phải cuộn ngang */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollableArea}>
              <View style={styles.scrollableRowsWrapper}>
                
                {/* Hàng 1: RUS */}
                <View style={styles.dataRow}>
                  {sizeData.map((item, idx) => (
                    <View key={idx} style={styles.dataCell}><Text style={styles.dataText}>{item.rus}</Text></View>
                  ))}
                </View>

                {/* Hàng 2: EUR */}
                <View style={styles.dataRow}>
                  {sizeData.map((item, idx) => (
                    <View key={idx} style={styles.dataCell}><Text style={styles.dataText}>{item.eur}</Text></View>
                  ))}
                </View>

                {/* Hàng 3: US */}
                <View style={styles.dataRow}>
                  {sizeData.map((item, idx) => (
                    <View key={idx} style={styles.dataCell}><Text style={styles.dataText}>{item.us}</Text></View>
                  ))}
                </View>

                {/* Hàng 4: UK */}
                <View style={styles.dataRow}>
                  {sizeData.map((item, idx) => (
                    <View key={idx} style={styles.dataCell}><Text style={styles.dataText}>{item.uk}</Text></View>
                  ))}
                </View>

                {/* Hàng 5: Длина стопы, см */}
                <View style={[styles.dataRow, styles.lastCell]}>
                  {sizeData.map((item, idx) => (
                    <View key={idx} style={styles.dataCell}><Text style={styles.dataText}>{item.cm}</Text></View>
                  ))}
                </View>

              </View>
            </ScrollView>

          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  closeBtn: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  body: { padding: 16 },
  
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  warningIcon: { fontSize: 16, marginRight: 8, marginTop: 2 },
  warningText: { flex: 1, fontSize: 13, color: '#666', lineHeight: 18 },

  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#111',
    marginBottom: 20,
  },

  /* Bảng size tổng thể */
  tableCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },

  /* Cột màu xanh cố định bên trái */
  fixedColumn: {
    width: 140,
    backgroundColor: '#eef2ff', // Màu nền xanh nhạt chuẩn Sportmaster
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
    zIndex: 10,
  },
  fixedCell: {
    height: 60,
    justifyContent: 'center',
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  fixedLabelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111',
    lineHeight: 18,
  },

  /* Phần cuộn ngang các số đo bên phải */
  scrollableArea: {
    flex: 1,
  },
  scrollableRowsWrapper: {
    flexDirection: 'column',
  },
  dataRow: {
    flexDirection: 'row',
    height: 60,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  dataCell: {
    width: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#f0f0f0',
  },
  dataText: {
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
  },
  lastCell: {
    borderBottomWidth: 0,
  },
});