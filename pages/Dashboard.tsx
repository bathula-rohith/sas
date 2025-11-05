import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { ICONS } from '../constants';
import { useTranslation } from '../context/TranslationContext';
import { useNotificationStore } from '../store/notificationStore';


const revenueData = [
  { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 }, { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 }, { name: 'Jun', revenue: 5500 },
];

const userActivityData = [
  { name: 'Mon', logins: 40, uploads: 24 }, { name: 'Tue', logins: 30, uploads: 13 },
  { name: 'Wed', logins: 20, uploads: 98 }, { name: 'Thu', logins: 27, uploads: 39 },
  { name: 'Fri', logins: 18, uploads: 48 }, { name: 'Sat', logins: 23, uploads: 38 },
  { name: 'Sun', logins: 34, uploads: 43 },
];

const MetricCard = ({ title, value, icon, change }: { title: string, value: string, icon: React.ReactElement, change?: string }) => (
    <div className="bg-surface p-4 rounded-xl shadow-sm flex items-start justify-between">
        <div>
            <h3 className="text-sm text-text-secondary font-medium">{title}</h3>
            <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
            {change && <p className={`text-xs mt-1 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</p>}
        </div>
        <div className="bg-primary/10 text-primary p-2 rounded-lg">
            {icon}
        </div>
    </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const showNotification = useNotificationStore((state) => state.showNotification);

  const recentActivity = [
    { user: 'Jane Doe', action: t('dashboard.activity.uploaded', { file: '"Marketing.pdf"' }), time: t('time.minutesAgo', { count: 2 }), avatar: 'https://i.pravatar.cc/150?u=user-2' },
    { user: 'John Smith', action: t('dashboard.activity.updatedProfile'), time: t('time.hoursAgo', { count: 1 }), avatar: 'https://i.pravatar.cc/150?u=user-3' },
    { user: 'Admin User', action: t('dashboard.activity.deletedAccount'), time: t('time.hoursAgo', { count: 3 }), avatar: 'https://i.pravatar.cc/150?u=user-1' },
    { user: 'Jane Doe', action: t('dashboard.activity.loggedIn'), time: t('time.hoursAgo', { count: 5 }), avatar: 'https://i.pravatar.cc/150?u=user-2' },
  ];
  
  const handleGenerateReport = () => {
    showNotification('Report generation has started and will be emailed to you shortly.');
  }

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-text-primary">{t('dashboard.welcome', { name: user?.name.split(' ')[0] })}</h1>
            <p className="text-text-secondary mt-1 text-sm">{t('dashboard.summary')}</p>
        </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title={t('dashboard.cards.totalUsers')} value="3" icon={ICONS.users} change={t('dashboard.cards.usersChange')} />
          <MetricCard title={t('dashboard.cards.filesStored')} value="3" icon={ICONS.files} />
          <MetricCard title={t('dashboard.cards.storageUsed')} value="2.1 MB" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>} />
          <MetricCard title={t('dashboard.cards.activeRole')} value={user?.role || ''} icon={ICONS.security} />
      </div>
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold text-text-primary mb-4 text-base">{t('dashboard.charts.revenueSummary')}</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                  <XAxis dataKey="name" stroke="var(--color-text-secondary)" tick={{fontSize: 12}} />
                  <YAxis stroke="var(--color-text-secondary)" tick={{fontSize: 12}}/>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', fontSize: '13px' }}/>
                  <Legend wrapperStyle={{fontSize: "13px"}} />
                  <Line type="monotone" dataKey="revenue" name={t('dashboard.charts.revenue')} stroke="rgb(var(--color-primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
             <div className="bg-surface p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-text-primary mb-4 text-base">{t('dashboard.charts.userActivity')}</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                    <XAxis dataKey="name" stroke="var(--color-text-secondary)" tick={{fontSize: 12}} />
                    <YAxis stroke="var(--color-text-secondary)" tick={{fontSize: 12}} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', fontSize: '13px' }}/>
                    <Legend wrapperStyle={{fontSize: "13px"}}/>
                    <Bar dataKey="logins" name={t('dashboard.charts.logins')} fill="rgb(var(--color-primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="uploads" name={t('dashboard.charts.uploads')} fill="rgb(var(--color-secondary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-text-primary mb-4 text-base">{t('dashboard.actions.title')}</h3>
                <div className="flex flex-col gap-3">
                    <button onClick={() => navigate('/security/users')} className="w-full text-left bg-primary/10 text-primary font-medium px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors text-sm">{t('dashboard.actions.addUser')}</button>
                    <button onClick={() => navigate('/file-system')} className="w-full text-left bg-primary/10 text-primary font-medium px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors text-sm">{t('dashboard.actions.uploadFile')}</button>
                    <button onClick={handleGenerateReport} className="w-full text-left bg-primary/10 text-primary font-medium px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors text-sm">{t('dashboard.actions.generateReport')}</button>
                </div>
            </div>
            <div className="bg-surface p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-text-primary mb-4 text-base">{t('dashboard.activity.title')}</h3>
                <ul className="space-y-4">
                    {recentActivity.map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <img src={item.avatar} alt={item.user} className="w-8 h-8 rounded-full"/>
                            <div className="flex-1">
                                <p className="text-sm text-text-primary">
                                    <span className="font-medium">{item.user}</span> {item.action}
                                </p>
                                <p className="text-xs text-text-secondary">{item.time}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;