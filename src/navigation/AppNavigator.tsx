import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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


// Import FloatingNavBar
import FloatingNavBar from '../components/FloatingNavBar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CustomTabNavigator() {
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
        

        return (
          <FloatingNavBar
            activeTab={activeLabel}
            onTabPress={(tabName) => {
              if (tabName === 'Главная') navigation.navigate('HomeTab');
              if (tabName === 'Каталог') navigation.navigate('CatelogyTab');
              if (tabName === 'Сервисы') navigation.navigate('ServicesTab');
              if (tabName === 'Корзина') navigation.navigate('CartTab');
              if (tabName === 'Профиль') navigation.navigate('ProfileTab');
            }}
            onStorePress={() => {
              console.log('Nút định vị cửa hàng được nhấn');
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}