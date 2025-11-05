import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TenantSettings } from '../types';

interface SettingsState extends TenantSettings {
  theme: 'light' | 'dark';
  setSettings: (settings: Partial<TenantSettings>) => void;
  resetToDefaults: () => void;
  toggleTheme: () => void;
}

const defaultSettings: Omit<TenantSettings, 'tenantId'> = {
  appName: 'Colloki',
  logoUrl: null,
  faviconUrl: null,
  primaryColor: '#3b82f6', // blue-500
  secondaryColor: '#64748b', // slate-500
  customDomain: '',
  supportEmail: '',
  hidePoweredBy: false,
  emailHeaderText: 'Welcome to our platform!',
  emailFooterText: '© 2024 Colloki. All rights reserved.',
  timezone: 'UTC',
  language: 'en',
  sessionTimeout: 60, // 60 minutes
  enforce2FA: false,
  notifications: {
    weeklySummary: true,
    productUpdates: true,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      tenantId: 'tenant-123',
      theme: 'light',
      setSettings: (settings) => set((state) => ({ ...state, ...settings })),
      resetToDefaults: () => set((state) => ({ ...state, ...defaultSettings })),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'colloki-settings-storage',
    }
  )
);