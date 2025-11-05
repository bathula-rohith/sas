import { create } from 'zustand';

type NotificationType = 'success' | 'error';

interface NotificationState {
  message: string | null;
  type: NotificationType;
  showNotification: (message: string, type?: NotificationType) => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: null,
  type: 'success',
  showNotification: (message, type = 'success') => set({ message, type }),
  hideNotification: () => set({ message: null }),
}));