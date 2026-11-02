import React, { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AppNavigator from './src/navigation/AppNavigator';
import OfflineScreen from './src/screens/OfflineScreen';

export default function App() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);
  const handleRefresh = () => {
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
    });
  };
  if (isConnected === false) {
    return <OfflineScreen onRefresh={handleRefresh} />;
  }
  return <AppNavigator />;
}