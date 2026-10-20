import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useCart } from '../hooks/useCart';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { cartController } from '../controllers/cartController';

// Import các màn hình
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import FilterScreen from '../screens/FilterScreen';
import CatelogyScreen from '../screens/CatelogyScreen';
import ServiceScreen from '../screens/ServiceScreen';
import SearchResultScreen from '../screens/SearchResultScreen';
// Import FloatingNavBar
import FloatingNavBar from '../components/FloatingNavBar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CustomTabNavigator() {
  const [totalCount, setTotalCount] = useState(0);
  useFocusEffect(
    useCallback(() => {
      const cartState = cartController.getCartState();
      setTotalCount(cartState?.totalItems || 0);
    }, [])
  );
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => {
        const currentRouteName = state.routeNames[state.index];
        
        let activeLabel = 'Главная';
        if (currentRouteName === 'HomeTab') activeLabel = 'Главная';
        if (currentRouteName === 'CatelogyTab') activeLabel = 'Каталог';
        if (currentRouteName === 'ServicesTab') activeLabel = 'Сервисы';
        if (currentRouteName === 'CartTab') activeLabel = 'Корзина';
        if (currentRouteName === 'ProfileTab') activeLabel = 'Профиль';
        if (currentRouteName === 'ProductDetail') activeLabel = 'Главная';

        return (
          <FloatingNavBar
            activeTab={activeLabel}
            cartCount={totalCount}
            onTabPress={(tabName) => {
              if (tabName === 'Главная') navigation.navigate('HomeTab');
              if (tabName === 'Каталог') navigation.navigate('CatelogyTab');
              if (tabName === 'Сервисы') navigation.navigate('ServicesTab');
              if (tabName === 'Корзина') navigation.navigate('CartTab');
              if (tabName === 'Профиль') navigation.navigate('ProfileTab');
            }}
            onStorePress={() => {
            }}
          />
        );
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="CatelogyTab" component={CatelogyScreen} />
      <Tab.Screen name="ServicesTab" component={ServiceScreen} /> 
      <Tab.Screen name="CartTab" component={CartScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
      <Tab.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Tab.Screen name="SearchResult" component={SearchResultScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={CustomTabNavigator} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Filter" component={FilterScreen} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="SearchResult" component={SearchResultScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}