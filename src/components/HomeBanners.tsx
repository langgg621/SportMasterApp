import React, { useRef, useState, useEffect } from 'react';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Banner } from '../models';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 32;

export const HomeBanners = ({ banners }: { banners: Banner[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (banners && banners.length > 0) {
        setActiveIndex((prev) => {
          const next = (prev + 1) % banners.length;
          scrollRef.current?.scrollTo({ x: next * BANNER_WIDTH, animated: true });
          return next;
        });
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  return (
    <View style={{ marginTop: 10 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ gap: 12 }}
      >
        {banners.map((b) => (
          <TouchableOpacity key={b.id} style={styles.bannerSlide} activeOpacity={0.9}>
            <Image source={{ uri: b.imageUrl }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.dotsRow}>
        {banners.map((_, i) => (
          <View key={i} style={[styles.dot, activeIndex === i ? styles.dotActive : styles.dotInactive]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerSlide: { width: BANNER_WIDTH, height: 200, borderRadius: 20, overflow: 'hidden', backgroundColor: '#111' },
  image: { width: BANNER_WIDTH, height: 200, position: 'absolute' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotActive: { backgroundColor: '#333' },
  dotInactive: { backgroundColor: '#d1d1d6' },
});