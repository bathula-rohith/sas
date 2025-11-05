
import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { Permission, RoleName } from '../types';
import { MOCK_ROLES } from '../services/api';

export const useRbac = () => {
  const { user } = useAuth();

  const hasPermission = useCallback((requiredPermission: Permission | Permission[]): boolean => {
    if (!user) return false;

    const userRole = MOCK_ROLES.find(r => r.name === user.role);
    if (!userRole) return false;

    if (user.role === RoleName.SYSTEM_ADMIN) return true; // System admin has all permissions

    const requiredPermissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    
    // For parent nav items, check if user has at least one of the child permissions
    return requiredPermissions.some(p => userRole.permissions.includes(p));
  }, [user]);

  return { hasPermission };
};
