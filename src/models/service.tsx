import { Ionicons } from '@expo/vector-icons';

export interface ServiceItem {
  id: string;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  bgColor: string;
  targetScreen?: string;
}

export interface ServiceSection {
  title: string;
  items: ServiceItem[];
}