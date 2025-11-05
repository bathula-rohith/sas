
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../store/settingsStore';

const ResetPassword: React.FC = () => {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();
    const navigate = useNavigate();
    const { primaryColor } = useSettingsStore();

    const onSubmit = async (data: any) => {
        if (data.newPassword !== data.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log('Password reset for token: [some_token]');
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Password has been reset successfully. Please log in with your new password.');
        navigate('/login');
    };

    return (
        <>
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Reset Your Password</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <input {...register("newPassword")} type="password" required placeholder="New Password" className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"/>
                <input {...register("confirmPassword")} type="password" required placeholder="Confirm New Password" className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"/>

                <div>
                    <button type="submit" disabled={isSubmitting} style={{ backgroundColor: primaryColor }} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </button>
                </div>
                <div className="text-center text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                        <Link to="/login" style={{ color: primaryColor }} className="font-medium hover:underline">
                            Back to login
                        </Link>
                    </p>
                </div>
            </form>
        </>
    );
};

export default ResetPassword;
