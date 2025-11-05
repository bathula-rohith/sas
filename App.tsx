import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSettingsStore } from './store/settingsStore';

import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Users from './pages/security/Users';
import Roles from './pages/security/Roles';
import AuditLogs from './pages/security/AuditLogs';
import Settings from './pages/Settings';
import FileSystem from './pages/FileSystem';
import Profile from './pages/Profile';
import ChannelConfiguration from './pages/ChannelConfiguration';
import { TranslationProvider } from './context/TranslationContext';


const App: React.FC = () => {
    const { theme, primaryColor, secondaryColor } = useSettingsStore();

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : null;
        }

        const primaryRgb = hexToRgb(primaryColor);
        if (primaryRgb) root.style.setProperty('--color-primary', primaryRgb);
        
        const secondaryRgb = hexToRgb(secondaryColor);
        if (secondaryRgb) root.style.setProperty('--color-secondary', secondaryRgb);

    }, [theme, primaryColor, secondaryColor]);

    return (
        <TranslationProvider>
            <HashRouter>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                    </Route>

                    <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/security/users" element={<Users />} />
                        <Route path="/security/roles" element={<Roles />} />
                        <Route path="/security/audit-logs" element={<AuditLogs />} />
                        <Route path="/settings" element={<Navigate to="/settings/branding" replace />} />
                        <Route path="/settings/:tab" element={<Settings />} />
                        <Route path="/file-system" element={<FileSystem />} />
                        <Route path="/channel-configuration" element={<ChannelConfiguration />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Routes>
            </HashRouter>
        </TranslationProvider>
    );
};

export default App;