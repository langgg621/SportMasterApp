import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FloatingNavBar from '../components/FloatingNavBar';
import { cartController } from '../controllers/cartController';
import { useCart } from '../hooks/useCart';
import { serviceController } from '../controllers/serviceController';
import { userController } from '../controllers/userController';

export default function ServicesScreen({ navigation }: { navigation: any }) {
  const profile = userController.getUserProfile();
  const sections = serviceController.getServiceSections();
  const { totalCount: totalCartCount, refresh: refreshCart } = useCart();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.locationBar}>
          <View style={styles.locationPin}>
            <Ionicons name="location-sharp" size={14} color="#fff" />
          </View>
          <Text style={styles.locationText} numberOfLines={1}>{profile.location}</Text>
          <Ionicons name="chevron-forward" size={16} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate('SearchScreen')}>
          <Ionicons name="chatbubble-outline" size={22} color="#111" />
          <View style={styles.chatBadge}><Text style={styles.chatBadgeText}>1</Text></View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        {sections.map((section, idx) => (
          <View key={idx} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {section.items.map((item) => (
                <TouchableOpacity key={item.id} style={styles.serviceItem} activeOpacity={0.8}>
                  <View style={[styles.iconBox, { backgroundColor: item.bgColor }]}>
                    <Ionicons name={item.iconName} size={28} color="#fff" />
                  </View>
                  <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6f8' },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#f5f6f8' },
  locationBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 20, marginRight: 12 },
  locationPin: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#005bff', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  locationText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#111' },
  chatBtn: { position: 'relative', padding: 6, justifyContent: 'center', alignItems: 'center' },
  chatBadge: { position: 'absolute', right: -2, top: 0, width: 18, height: 18, borderRadius: 9, backgroundColor: '#f3203d', justifyContent: 'center', alignItems: 'center' },
  chatBadgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
  sectionCard: { backgroundColor: '#fff', borderRadius: 20, marginHorizontal: 16, marginTop: 12, paddingVertical: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', paddingHorizontal: 16, marginBottom: 14 },
  horizontalScroll: { paddingHorizontal: 16, gap: 16 },
  serviceItem: { width: 72, alignItems: 'center' },
  iconBox: { width: 58, height: 58, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 3 },
  itemTitle: { fontSize: 11, color: '#111', fontWeight: '500', textAlign: 'center', lineHeight: 14 },
});