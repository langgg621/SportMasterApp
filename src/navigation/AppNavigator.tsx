import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useCart } from '../hooks/useCart';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import FilterScreen from '../screens/FilterScreen';
import CatelogyScreen from '../screens/CatelogyScreen';
import SearchResultScreen from '../screens/SearchResultScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import NoInternetScreen from '../screens/OfflineScreen';
import FloatingNavBar from '../components/FloatingNavBar';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MapPickerScreen from '../screens/MapPickerScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// route trong Tab <-> nhãn trên FloatingNavBar
const ROUTE_TO_LABEL: Record<string, string> = {
  HomeTab: 'Главная',
  CatelogyTab: 'Каталог',
  ServicesTab: 'Сервисы',
  CartTab: 'Корзина',
  ProfileTab: 'Профиль',
};
const LABEL_TO_ROUTE = Object.fromEntries(Object.entries(ROUTE_TO_LABEL).map(([r, l]) => [l, r]));

function CustomTabNavigator() {
  const { totalCount } = useCart(); // store dùng chung -> badge luôn đúng

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <FloatingNavBar
          activeTab={ROUTE_TO_LABEL[state.routeNames[state.index]] ?? 'Главная'}
          cartCount={totalCount}
          onTabPress={(tabName) => {
            const route = LABEL_TO_ROUTE[tabName];
            if (route) navigation.navigate(route);
          }}
          onStorePress={() => {}}
        />
      )}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="CatelogyTab" component={CatelogyScreen} />
      <Tab.Screen name="CartTab" component={CartScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

/**
 * ProductDetail, SearchResult, NoInternetScreen trước đây bị khai báo ở CẢ Tab lẫn Stack.
 * Khi mở từ tab, React Navigation dùng bản trong Tab -> thanh tabBar của navigator + FloatingNavBar
 * do chính màn hình vẽ => bị 2 thanh nav chồng nhau. Giờ chỉ khai báo ở Stack; các màn này tự vẽ
 * FloatingNavBar bằng useFloatingNav().
 */
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
        <Stack.Screen name="OrderSuccessScreen" component={OrderSuccessScreen} />
        <Stack.Screen name="NoInternetScreen" component={NoInternetScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MapPicker" component={MapPickerScreen} options={{ headerShown: false }} /> 
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ headerShown: false }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
