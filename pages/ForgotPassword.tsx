
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '../store/settingsStore';

const ForgotPassword: React.FC = () => {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();
    const { primaryColor } = useSettingsStore();

    const onSubmit = async (data: any) => {
        console.log('Password reset request for:', data.email);
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('If an account exists for this email, a reset link has been sent.');
    };

    return (
        <>
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Forgot Password</h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Enter your email and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <input {...register("email")} type="email" required placeholder="Email Address" className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"/>
                <div>
                    <button type="submit" disabled={isSubmitting} style={{ backgroundColor: primaryColor }} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </div>
                <div className="text-center text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                        Remembered your password?{' '}
                        <Link to="/login" style={{ color: primaryColor }} className="font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </form>
        </>
    );
};

export default ForgotPassword;
