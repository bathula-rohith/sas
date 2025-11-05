import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ICONS } from '../constants';
import { useSettingsStore } from '../store/settingsStore';
import { useTranslation } from '../context/TranslationContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useSettingsStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const mockNotifications = [
    { id: 1, text: t('header.notifications.userRegistered', {name: 'John Doe'}), time: t('time.minutesAgo', {count: 15}) },
    { id: 2, text: t('header.notifications.reportReady'), time: t('time.hoursAgo', {count: 1}) },
    { id: 3, text: t('header.notifications.maintenance'), time: t('time.daysAgo', {count: 1}) },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-surface border-b border-border-default flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
      <div className="flex items-center">
        {/* Mobile menu button can go here if needed */}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="p-2 rounded-full text-text-secondary hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none" aria-label={t('header.toggleTheme')}>
            {theme === 'light' ? ICONS.moon : ICONS.sun}
        </button>
        
        <div className="relative" ref={notificationsRef}>
            <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 rounded-full text-text-secondary hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none relative" aria-label={t('header.notifications.title')}>
                {ICONS.bell}
                <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
             {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-surface rounded-md shadow-lg z-50 border border-border-default">
                    <div className="p-3 border-b border-border-default">
                        <h3 className="font-semibold text-sm text-text-primary">{t('header.notifications.title')}</h3>
                    </div>
                    <ul className="py-1 max-h-80 overflow-y-auto">
                        {mockNotifications.map(notif => (
                            <li key={notif.id} className="px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5">
                                <p className="text-sm text-text-primary">{notif.text}</p>
                                <p className="text-xs text-text-secondary mt-0.5">{notif.time}</p>
                            </li>
                        ))}
                    </ul>
                     <div className="p-2 border-t border-border-default text-center">
                        <Link to="#" onClick={() => setNotificationsOpen(false)} className="text-sm text-primary hover:underline">
                            {t('header.notifications.viewAll')}
                        </Link>
                    </div>
                </div>
            )}
        </div>

        <div className="w-px h-6 bg-border-default hidden sm:block"></div>
        
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-3">
            <img className="h-8 w-8 rounded-full object-cover" src={user?.avatarUrl} alt={t('header.userAvatarAlt')} />
            <div className="hidden text-left md:block">
                <p className="font-medium text-sm text-text-primary">{user?.name}</p>
                <p className="text-xs text-text-secondary">{user?.role}</p>
            </div>
            <span className="hidden md:block text-text-secondary">{ICONS.chevronDown}</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg py-1 z-50 border border-border-default">
              <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-black/5 dark:hover:bg-white/5">
                  {ICONS.profile} {t('header.profile')}
              </Link>
              <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-black/5 dark:hover:bg-white/5">
                  {ICONS.logout} {t('header.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
