import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleName, User } from '../types';
import { useSettingsStore } from '../store/settingsStore';
import { useTranslation } from '../context/TranslationContext';

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { primaryColor } = useSettingsStore();
  const { t } = useTranslation();

  const onSubmit = async (data: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 'user-1',
      name: 'Admin User',
      email: data.email,
      role: RoleName.TENANT_ADMIN,
      tenantId: 'tenant-123',
      createdAt: new Date().toISOString(),
      avatarUrl: 'https://picsum.photos/100',
    };
    
    login(mockUser);
    navigate('/dashboard');
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">{t('login.title')}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <input
              id="email-address"
              type="email"
              autoComplete="email"
              required
              {...register("email")}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder={t('login.emailPlaceholder')}
              defaultValue="admin@colloki.com"
            />
          </div>
          <div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              {...register("password")}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder={t('login.passwordPlaceholder')}
              defaultValue="password"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link to="/forgot-password" style={{ color: primaryColor }} className="font-medium hover:underline">
              {t('login.forgotPassword')}
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ backgroundColor: isSubmitting ? '' : primaryColor }}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isSubmitting ? t('login.signingIn') : t('login.signIn')}
          </button>
        </div>
        <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
                {t('login.noAccount')}{' '}
                <Link to="/register" style={{ color: primaryColor }} className="font-medium hover:underline">
                    {t('login.registerHere')}
                </Link>
            </p>
        </div>
      </form>
    </>
  );
};

export default Login;
