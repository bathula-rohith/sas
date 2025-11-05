import { User, Role, AuditLog, TenantFile, TenantSettings, RoleName, Permission } from '../types';

// --- MOCK DATA ---
let MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Admin User', email: 'admin@colloki.com', role: RoleName.TENANT_ADMIN, tenantId: 'tenant-123', createdAt: new Date('2023-10-26T10:00:00Z').toISOString(), avatarUrl: 'https://i.pravatar.cc/150?u=user-1' },
  { id: 'user-2', name: 'Jane Doe', email: 'jane.doe@colloki.com', role: RoleName.USER, tenantId: 'tenant-123', createdAt: new Date('2023-10-25T11:30:00Z').toISOString(), avatarUrl: 'https://i.pravatar.cc/150?u=user-2' },
  { id: 'user-3', name: 'John Smith', email: 'john.smith@colloki.com', role: RoleName.USER, tenantId: 'tenant-123', createdAt: new Date('2023-10-24T15:00:00Z').toISOString(), avatarUrl: 'https://i.pravatar.cc/150?u=user-3' },
];

export let MOCK_ROLES: Role[] = [
  { id: 'role-1', name: RoleName.TENANT_ADMIN, description: 'Has full access to manage the tenant.', permissions: Object.values(Permission) },
  { id: 'role-2', name: RoleName.USER, description: 'Has basic access to the system.', permissions: [Permission.VIEW_DASHBOARD, Permission.VIEW_FILES, Permission.MANAGE_OWN_PROFILE] },
  { id: 'role-3', name: RoleName.SYSTEM_ADMIN, description: 'Has access to the entire system.', permissions: Object.values(Permission) },
];

let MOCK_AUDIT_LOGS: AuditLog[] = [
    { id: 'log-1', userId: 'user-1', userName: 'Admin User', action: 'USER_LOGIN', details: 'User logged in successfully.', timestamp: new Date('2023-10-27T09:00:00Z').toISOString() },
    { id: 'log-2', userId: 'user-2', userName: 'Jane Doe', action: 'FILE_UPLOAD', details: 'Uploaded file "report.pdf".', timestamp: new Date('2023-10-27T09:05:00Z').toISOString() },
    { id: 'log-3', userId: 'user-1', userName: 'Admin User', action: 'USER_UPDATE', details: 'Updated profile for user John Smith.', timestamp: new Date('2023-10-27T09:10:00Z').toISOString() },
    { id: 'log-4', userId: 'user-3', userName: 'John Smith', action: 'USER_LOGIN', details: 'User logged in successfully.', timestamp: new Date('2023-10-27T09:12:00Z').toISOString() },
];

let MOCK_FILES: TenantFile[] = [
    { id: 'file-1', name: 'Q3 Financial Report.pdf', type: 'application/pdf', size: 1234567, uploadedAt: new Date('2023-10-26T14:00:00Z').toISOString(), url: '#' },
    { id: 'file-2', name: 'Marketing Campaign.jpg', type: 'image/jpeg', size: 876543, uploadedAt: new Date('2023-10-25T16:30:00Z').toISOString(), url: '#' },
    { id: 'file-3', name: 'Onboarding Guide.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 45678, uploadedAt: new Date('2023-10-24T10:15:00Z').toISOString(), url: '#' },
];

let MOCK_TENANT_SETTINGS: TenantSettings = {
    tenantId: 'tenant-123',
    appName: 'Colloki',
    logoUrl: null,
    faviconUrl: null,
    primaryColor: '#4f46e5',
    secondaryColor: '#0ea5e9',
    customDomain: 'app.colloki.com',
    supportEmail: 'support@colloki.com',
    hidePoweredBy: false,
    emailHeaderText: 'Welcome!',
    emailFooterText: '© 2024 Colloki Inc.',
    timezone: 'UTC',
    language: 'en',
    sessionTimeout: 60,
    enforce2FA: false,
    notifications: {
        weeklySummary: true,
        productUpdates: true,
    },
};

const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => 
    new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));

// --- USER API ---
export const fetchUsers = () => simulateApiCall(MOCK_USERS);
export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'tenantId' | 'avatarUrl'> & {role: RoleName}) => {
    const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        tenantId: 'tenant-123',
        createdAt: new Date().toISOString(),
        avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
    };
    MOCK_USERS.push(newUser);
    return simulateApiCall(newUser);
};
export const updateUser = async (userData: User) => {
    MOCK_USERS = MOCK_USERS.map(u => u.id === userData.id ? { ...u, ...userData } : u);
    return simulateApiCall(userData);
};
export const deleteUser = async (userId: string) => {
    MOCK_USERS = MOCK_USERS.filter(u => u.id !== userId);
    return simulateApiCall({ success: true });
};

// --- ROLE API ---
export const fetchRoles = () => simulateApiCall(MOCK_ROLES);
export const updateRole = async (roleData: Role) => {
    MOCK_ROLES = MOCK_ROLES.map(r => r.id === roleData.id ? { ...r, ...roleData } : r);
    return simulateApiCall(roleData);
};

// --- AUDIT LOG API ---
export const fetchAuditLogs = () => simulateApiCall(MOCK_AUDIT_LOGS);

// --- FILE SYSTEM API ---
export const fetchFiles = () => simulateApiCall(MOCK_FILES);
export const deleteFile = async (fileId: string) => {
    MOCK_FILES = MOCK_FILES.filter(f => f.id !== fileId);
    return simulateApiCall({ success: true });
};

// --- SETTINGS API ---
export const updateTenantSettings = async (settings: Partial<TenantSettings>) => {
    MOCK_TENANT_SETTINGS = { ...MOCK_TENANT_SETTINGS, ...settings };
    return simulateApiCall(MOCK_TENANT_SETTINGS);
};