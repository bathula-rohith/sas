import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useRbac } from '../hooks/useRbac';
import { NAVIGATION_ITEMS, ICONS } from '../constants';
import { useSettingsStore } from '../store/settingsStore';
import { NavItemType } from '../types';
import { useTranslation } from '../context/TranslationContext';

const Sidebar: React.FC = () => {
  const { hasPermission } = useRbac();
  const { logoUrl, appName } = useSettingsStore();
  const { t } = useTranslation();
  const location = useLocation();

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const isChildActive = (children: NavItemType[]): boolean => {
    return children.some(child => child.path && location.pathname.startsWith(child.path));
  };
  
  useEffect(() => {
    // Open parent menu if a child is active on initial render
    const newOpenMenus: Record<string, boolean> = {};
    NAVIGATION_ITEMS.forEach(item => {
      if (item.children && isChildActive(item.children)) {
        newOpenMenus[item.titleKey] = true;
      }
    });
    setOpenMenus(newOpenMenus);
  }, []); // Run only once on mount

  const toggleMenu = (titleKey: string) => {
    setOpenMenus(prev => ({ ...prev, [titleKey]: !prev[titleKey] }));
  };
  
  interface NavItemProps {
    item: NavItemType;
  }
  
  const NavItem: React.FC<NavItemProps> = ({ item }) => {
    const commonClasses = "flex items-center space-x-3 w-full px-4 py-2.5 rounded-md transition-colors duration-200 text-sm font-medium relative";
    const activeClass = "bg-primary/10 text-primary font-semibold";
    const inactiveClass = "text-text-secondary hover:bg-primary/5 hover:text-text-primary";
    
    if (item.children) {
      if (!hasPermission(item.permission)) return null;

      const isActive = isChildActive(item.children);
      const title = t(item.titleKey);
      
      return (
        <div>
          <button
            onClick={() => toggleMenu(item.titleKey)}
            className={`${commonClasses} justify-between ${isActive ? 'text-primary' : 'text-text-secondary'}`}
          >
            {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full"></div>}
            <div className="flex items-center space-x-3">
              <span className={isActive ? 'text-primary' : ''}>{item.icon}</span>
              {item.titleKey === 'sidebar.commonSettings' ? (
                <span className="leading-tight text-left" dangerouslySetInnerHTML={{ __html: title.replace(' ', '<br />') }} />
              ) : (
                <span>{title}</span>
              )}
            </div>
            <span className={`transform transition-transform duration-200 ${openMenus[item.titleKey] ? 'rotate-180' : ''}`}>
              {ICONS.chevronDown}
            </span>
          </button>
          {openMenus[item.titleKey] && (
            <div className="pl-8 mt-1 space-y-1">
              {item.children.map((child) => (
                <NavItem item={child} key={child.titleKey} />
              ))}
            </div>
          )}
        </div>
      );
    }

    if (!hasPermission(item.permission)) return null;

    return (
      <NavLink
        to={item.path!}
        className={({ isActive }) => `${commonClasses} ${isActive ? activeClass : inactiveClass}`}
      >
        {({ isActive }) => (
            <>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full"></div>}
                {item.icon}
                <span>{t(item.titleKey)}</span>
            </>
        )}
      </NavLink>
    );
  };
  
  return (
    <aside className="w-56 flex-shrink-0 bg-surface border-r border-border-default flex flex-col">
      <div className="h-16 flex items-center px-4 border-b border-border-default">
        <div className="flex items-center space-x-3">
            {logoUrl ? <img src={logoUrl} alt="Logo" className="h-8 w-auto" />
            : <div className="w-7 h-7 bg-primary rounded-lg"></div>
            }
            <h1 className="text-xl font-bold text-text-primary">{appName}</h1>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1.5">
        {NAVIGATION_ITEMS.map(item => (
          <NavItem item={item} key={item.titleKey} />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;