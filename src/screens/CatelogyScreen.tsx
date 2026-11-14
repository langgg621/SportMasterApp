import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { categoryController } from '../controllers/catalogController';
import { userController } from '../controllers/userController';

export default function CatalogScreen({ navigation }: { navigation: any }) {
  // usp_get_catalog_sections -> rows { sectionType, id, title, image, sortOrder }
  const rows: any[] = useMemo(() => categoryController.getCatalogSections(), []);
  const unreadChat = userController.getUnreadChatCount();

  const serviceCards = useMemo(() => rows.filter((r) => r.sectionType === 'service'), [rows]);
  // Các lưới còn lại (gender / category / sport...) được nhóm theo sectionType, giữ nguyên thứ tự DB trả về
  const gridSections = useMemo(() => {
    const groups: Record<string, any[]> = {};
    rows.filter((r) => r.sectionType !== 'service').forEach((r) => {
      if (!groups[r.sectionType]) groups[r.sectionType] = [];
      groups[r.sectionType].push(r);
    });
    return Object.values(groups);
  }, [rows]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topSearchRow}>
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('SearchScreen')}>
          <Ionicons name="search-outline" size={18} color="#8e8e93" style={{ marginRight: 8 }} />
          <Text style={styles.searchText}>Искать в Спортмастере</Text>
          <Ionicons name="barcode-outline" size={20} color="#8e8e93" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate('SearchScreen')}>
          <Ionicons name="chatbubble-outline" size={22} color="#111" />
          {unreadChat > 0 && <View style={styles.chatBadge}><Text style={styles.chatBadgeText}>{unreadChat}</Text></View>}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {serviceCards.map((item) => (
            <TouchableOpacity key={item.id} style={styles.serviceCard} activeOpacity={0.9}>
              <Text style={styles.serviceTitle} numberOfLines={2}>{item.title}</Text>
              <Image source={{ uri: item.image }} style={styles.serviceImg} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {gridSections.map((cards, idx) => (
          <View key={idx} style={styles.gridContainer}>
            {cards.map((item) => (
              <TouchableOpacity key={item.id} style={styles.gridCardLarge} activeOpacity={0.9}>
                <View style={styles.cardTextWrapper}>
                  <Text style={styles.gridTitleLarge}>{item.title}</Text>
                </View>
                <Image source={{ uri: item.image }} style={styles.gridImgLarge} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topSearchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f2f6', borderRadius: 22, paddingHorizontal: 14, height: 44, marginRight: 10 },
  searchText: { flex: 1, color: '#8e8e93', fontSize: 15 },
  chatBtn: { position: 'relative', padding: 6, justifyContent: 'center', alignItems: 'center' },
  chatBadge: { position: 'absolute', right: -2, top: 0, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, backgroundColor: '#f3203d', justifyContent: 'center', alignItems: 'center' },
  chatBadgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },

  horizontalScroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  serviceCard: { width: 92, height: 120, backgroundColor: '#f2f4f8', borderRadius: 16, padding: 10, justifyContent: 'space-between', overflow: 'hidden', position: 'relative' },
  serviceTitle: { fontSize: 12, fontWeight: '700', color: '#111', zIndex: 2, lineHeight: 15 },
  serviceImg: { width: 70, height: 70, position: 'absolute', bottom: -5, right: -5, resizeMode: 'contain' },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, justifyContent: 'space-between', marginBottom: 12 },
  gridCardLarge: { width: '31.5%', height: 170, backgroundColor: '#f2f4f8', borderRadius: 16, padding: 12, overflow: 'hidden', position: 'relative', marginBottom: 12 },
  cardTextWrapper: { zIndex: 2, width: '100%' },
  gridTitleLarge: { fontSize: 13, fontWeight: 'bold', color: '#111', lineHeight: 16 },
  gridImgLarge: { width: '100%', height: 110, position: 'absolute', bottom: 0, right: 0, left: 0, resizeMode: 'cover', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
});
