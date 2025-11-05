import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSettingsStore } from '../store/settingsStore';

const AuthLayout: React.FC = () => {
    const { logoUrl, appName } = useSettingsStore();
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center items-center">
                    {logoUrl && <img src={logoUrl} alt="Logo" className="h-12 w-auto" />}
                    <h1 className="ml-3 text-3xl font-bold text-gray-900 dark:text-white">{appName}</h1>
                </div>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;