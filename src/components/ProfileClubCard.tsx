import React from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../models/user';

interface Props {
  profile: User | null;
  cardHeight: any; // Animated.Value
}

export const ProfileClubCard = ({ profile, cardHeight }: Props) => {
  if (!profile) return null;

  // Giả lập cấp độ và cashback dựa trên membershipRank (1: Thường, 2: Vàng, 3: VIP)
  const rankText = profile.membershipRank === 3 ? 'VIP' : profile.membershipRank === 2 ? 'Золотой' : 'Стандартный';
  const cashback = profile.membershipRank === 3 ? '15%' : profile.membershipRank === 2 ? '10%' : '5%';

  return (
    <Animated.View style={[styles.blueCard, { height: cardHeight }]}>
      <View style={styles.bonusLeftRow}>
        <Text style={styles.bonusNumber}>{profile.bonusPoints || 0}</Text>
        <View style={styles.coinCircle}>
          <Ionicons name="flash" size={12} color="#005bff" />
        </View>
      </View>

      <View style={styles.bonusBadge}>
        <Text style={styles.bonusBadgeText}>🔥 {profile.bonusPoints || 0} бонусов до 20.03.2027</Text>
      </View>

      <View style={styles.qrWhiteBox}>
        <Image 
          source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SPORTMASTER_${profile.id}` }} 
          style={styles.qrImage}
        />
      </View>

      <View style={styles.cardFooterRow}>
        <View style={styles.footerCol}>
          <Text style={styles.footerLabel}>Уровень участия</Text>
          <Text style={styles.footerValue}>{rankText}</Text>
        </View>
        <View style={styles.footerColRight}>
          <Text style={styles.footerLabel}>Кешбэк</Text>
          <Text style={styles.footerValue}>{cashback}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  blueCard: { backgroundColor: '#005bff', borderRadius: 24, padding: 20, alignItems: 'flex-start', overflow: 'hidden' },
  bonusLeftRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  bonusNumber: { fontSize: 36, fontWeight: '900', color: '#fff' },
  coinCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#ffcc00', justifyContent: 'center', alignItems: 'center', marginLeft: 6 },
  bonusBadge: { backgroundColor: '#e53238', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 16 },
  bonusBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  qrWhiteBox: { backgroundColor: '#fff', borderRadius: 20, padding: 12, alignSelf: 'center', marginBottom: 12 },
  qrImage: { width: 160, height: 160, resizeMode: 'contain' },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 4 },
  footerCol: { alignItems: 'flex-start' },
  footerColRight: { alignItems: 'flex-end' },
  footerLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  footerValue: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginTop: 2 },
});