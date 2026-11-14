import { useCart } from './useCart';

// Tên tab trên FloatingNavBar -> route trong MainTabs (đối chiếu với AppNavigator)
const TAB_ROUTES: Record<string, string> = {
  'Главная': 'HomeTab',
  'Каталог': 'CatelogyTab',
  'Сервисы': 'ServicesTab',
  'Корзина': 'CartTab',
  'Профиль': 'ProfileTab',
};
export function useFloatingNav(navigation?: any) {
  const { totalCount } = useCart();
  return {
    cartCount: totalCount,
    onTabPress: (tabName: string) => {
      const screen = TAB_ROUTES[tabName];
      if (screen && navigation) navigation.navigate('MainTabs', { screen });
    },
    onStorePress: () => {},
  };
}
