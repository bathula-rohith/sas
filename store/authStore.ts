import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, RoleName } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  tenantId: string | null;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const mockUser: User = {
  id: 'user-1',
  name: 'Admin User',
  email: 'admin@colloki.com',
  role: RoleName.TENANT_ADMIN,
  tenantId: 'tenant-123',
  createdAt: new Date().toISOString(),
  avatarUrl: 'https://picsum.photos/100',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      tenantId: null,
      login: (user) => set({ isAuthenticated: true, user, tenantId: user.tenantId }),
      logout: () => set({ isAuthenticated: false, user: null, tenantId: null }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'colloki-auth-storage', // unique name
    }
  )
);