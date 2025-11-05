import type { ReactElement } from 'react';

export enum RoleName {
    SYSTEM_ADMIN = 'System Admin',
    TENANT_ADMIN = 'Tenant Admin',
    USER = 'User',
}

export enum Permission {
    // User Permissions
    VIEW_USERS = 'view:users',
    MANAGE_USERS = 'manage:users',
    // Role Permissions
    VIEW_ROLES = 'view:roles',
    MANAGE_ROLES = 'manage:roles',
    // Audit Log Permissions
    VIEW_AUDIT_LOGS = 'view:audit-logs',
    EXPORT_AUDIT_LOGS = 'export:audit-logs',
    // Settings Permissions
    VIEW_SETTINGS = 'view:settings',
    MANAGE_SETTINGS = 'manage:settings',
    // File System Permissions
    VIEW_FILES = 'view:files',
    MANAGE_FILES = 'manage:files',
    // Dashboard
    VIEW_DASHBOARD = 'view:dashboard',
    // Profile
    MANAGE_OWN_PROFILE = 'manage:own-profile',
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: RoleName;
    tenantId: string;
    createdAt: string;
    avatarUrl: string;
}

export interface Role {
    id: string;
    name: RoleName;
    description: string;
    permissions: Permission[];
}

export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    details: string;
    timestamp: string;
}

export interface TenantFile {
    id: string;
    name: string;
    type: string;
    size: number; // in bytes
    uploadedAt: string;
    url: string;
}

export interface TenantSettings {
    tenantId: string;
    appName: string;
    logoUrl: string | null;
    faviconUrl: string | null;
    primaryColor: string;
    secondaryColor: string;
    customDomain: string;
    supportEmail: string;
    hidePoweredBy: boolean;
    emailHeaderText: string;
    emailFooterText: string;
    timezone: string;
    language: string;
    sessionTimeout: number; // in minutes
    enforce2FA: boolean;
    notifications: {
        weeklySummary: boolean;
        productUpdates: boolean;
    };
}

export interface NavItemType {
  titleKey: string;
  path?: string;
  icon: ReactElement;
  permission: Permission | Permission[];
  children?: NavItemType[];
}