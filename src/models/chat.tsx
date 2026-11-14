export interface ChatMessage {
  id: string;
  userId: string;
  sender: 'user' | 'support';
  body: string;
  isRead: boolean;
  createDate: string;
}

export interface ProfileMenuItem {
  id: string;
  title: string;
  icon: string;
  badgeText?: string;
  isNew: boolean;
  sortOrder: number;
  isActive: boolean;
}