import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useSettingsStore } from '../store/settingsStore';

const Profile: React.FC = () => {
    const { user, setUser } = useAuth();
    const { primaryColor } = useSettingsStore();

    const { register: registerInfo, handleSubmit: handleSubmitInfo } = useForm({
        defaultValues: {
            name: user?.name,
            email: user?.email,
        }
    });

    const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword } = useForm();
    
    const onInfoSubmit = (data: any) => {
        if (user) {
            setUser({ ...user, ...data });
            alert('Profile information updated!');
        }
    };
    
    const onPasswordSubmit = (data: any) => {
        if (data.newPassword !== data.confirmPassword) {
            alert('New passwords do not match.');
            return;
        }
        console.log('Changing password...');
        alert('Password changed successfully!');
        resetPassword();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">User Profile</h1>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
                <form onSubmit={handleSubmitInfo(onInfoSubmit)} className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <img src={user?.avatarUrl} alt="avatar" className="w-20 h-20 rounded-full"/>
                        <button type="button" className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md text-xs">Change Avatar</button>
                    </div>
                     <div>
                        <label className="block text-xs font-medium">Name</label>
                        <input {...registerInfo('name')} className="w-full mt-1 p-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"/>
                    </div>
                     <div>
                        <label className="block text-xs font-medium">Email</label>
                        <input type="email" {...registerInfo('email')} className="w-full mt-1 p-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"/>
                    </div>
                    <div className="text-right">
                        <button type="submit" style={{ backgroundColor: primaryColor }} className="text-white px-4 py-2 rounded-md hover:opacity-90 text-sm">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
                     <div>
                        <label className="block text-xs font-medium">Current Password</label>
                        <input type="password" {...registerPassword('currentPassword', { required: true })} className="w-full mt-1 p-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"/>
                    </div>
                     <div>
                        <label className="block text-xs font-medium">New Password</label>
                        <input type="password" {...registerPassword('newPassword', { required: true })} className="w-full mt-1 p-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"/>
                    </div>
                     <div>
                        <label className="block text-xs font-medium">Confirm New Password</label>
                        <input type="password" {...registerPassword('confirmPassword', { required: true })} className="w-full mt-1 p-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"/>
                    </div>
                    <div className="text-right">
                        <button type="submit" style={{ backgroundColor: primaryColor }} className="text-white px-4 py-2 rounded-md hover:opacity-90 text-sm">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
