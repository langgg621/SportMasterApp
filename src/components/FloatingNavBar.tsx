import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FloatingNavBarProps {
  activeTab?: string;
  cartCount?: number; // Thêm prop cartCount
  onTabPress?: (tabName: string) => void;
  onStorePress?: () => void;
}

export default function FloatingNavBar({ 
  activeTab = 'Главная', 
  cartCount = 0,
  onTabPress, 
  onStorePress 
}: FloatingNavBarProps) {
  const navItems = [
    { name: 'home', label: 'Главная' },
    { name: 'catalog', label: 'Каталог' },
    { name: 'services', label: 'Сервисы' },
    { name: 'cart', label: 'Корзина' },
    { name: 'profile', label: 'Профиль' },
  ];

  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    home: 'home-outline',
    catalog: 'albums-outline',
    services: 'grid-outline',
    cart: 'cart-outline',
    profile: 'person-outline',
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.inStoreBtn} 
        activeOpacity={0.8}
        onPress={onStorePress}
      >
        <Ionicons name="navigate-outline" size={22} color="#7aaaff" />
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        {navItems.map(({ name, label }) => {
          const isSelected = activeTab === label;
          const isCart = label === 'Корзина';

          return (
            <TouchableOpacity 
              key={label} 
              style={styles.navItem}
              activeOpacity={0.7}
              onPress={() => onTabPress && onTabPress(label)}
            >
              <View style={{ position: 'relative' }}>
                <Ionicons 
                  name={iconMap[name]} 
                  size={22} 
                  color={isSelected ? '#086ee7' : '#b4b7bd'} 
                />
                {/* Badge hiển thị số lượng giỏ hàng */}
                {isCart && cartCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>
                      {cartCount > 99 ? '99+' : cartCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.navText, isSelected && styles.navTextSelected]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inStoreBtn: {
    position: 'absolute',
    bottom: 88,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#171d31',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 30,
    marginBottom: 30,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    width: '90%',
    maxWidth: 348,
    height: 68,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#111',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 29,
    marginBottom: 30,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navText: {
    fontSize: 9,
    color: '#b4b7bd',
  },
  navTextSelected: {
    color: '#086ee7',
    fontWeight: '700',
  },
  /* Badge đỏ hiển thị số lượng sản phẩm trên icon giỏ hàng */
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#ff3b30',
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});