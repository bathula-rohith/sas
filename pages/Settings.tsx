import React, { useState, useEffect, ReactNode } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useSettingsStore } from '../store/settingsStore';
import { updateTenantSettings } from '../services/api';
import { useTranslation } from '../context/TranslationContext';
import { useNotificationStore } from '../store/notificationStore';
import TwoFactorAuthModal from '../components/TwoFactorAuthModal';
import { ICONS } from '../constants';
import IntegrationWizard from '../components/IntegrationWizard';


type SettingsTab = 'branding' | 'general' | 'security' | 'notifications' | 'integrations';

const timezones = [
    { value: 'America/New_York', label: '(GMT-05:00) Eastern Time (US & Canada)' },
    { value: 'America/Chicago', label: '(GMT-06:00) Central Time (US & Canada)' },
    { value: 'America/Denver', label: '(GMT-07:00) Mountain Time (US & Canada)' },
    { value: 'America/Los_Angeles', label: '(GMT-08:00) Pacific Time (US & Canada)' },
    { value: 'Europe/London', label: '(GMT+00:00) London, Dublin' },
    { value: 'Europe/Paris', label: '(GMT+01:00) Amsterdam, Berlin, Paris' },
    { value: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo, Seoul' },
    { value: 'Australia/Sydney', label: '(GMT+10:00) Sydney' },
];

const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'es', name: 'Español (Spanish)' },
    { code: 'fr', name: 'Français (French)' },
    { code: 'de', name: 'Deutsch (German)' },
];

const baseInputClasses = "w-full mt-1 p-2 border border-border-default rounded-md bg-transparent text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow";

const SettingsCard: React.FC<{ title: string; description?: string, children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-surface rounded-lg shadow-sm border border-border-default">
        <div className="p-5">
            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
            {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
        </div>
        <div className="p-5 border-t border-border-default">
            {children}
        </div>
    </div>
);

const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${checked ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}/>
        </button>
    );
}

const Settings: React.FC = () => {
    const { t } = useTranslation();
    const { tab } = useParams<{ tab: string }>();
    const activeTab = (tab || 'branding') as SettingsTab;
    
    const tabTitles: Record<SettingsTab, string> = {
        branding: t('settings.tabs.branding'),
        general: t('settings.tabs.general'),
        security: t('settings.tabs.security'),
        notifications: t('settings.tabs.notifications'),
        integrations: t('settings.tabs.integrations'),
    };

    return (
         <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">{tabTitles[activeTab]}</h1>
            <div className="flex-1">
                <TabContent activeTab={activeTab} />
            </div>
        </div>
    );
};


const TabContent: React.FC<{activeTab: SettingsTab}> = ({ activeTab }) => {
    switch (activeTab) {
        case 'branding': return <BrandingSettings />;
        case 'general': return <GeneralSettings />;
        case 'security': return <SecuritySettings />;
        case 'notifications': return <NotificationSettings />;
        case 'integrations': return <Integrations />;
        default: return null;
    }
};

const useSettingsForm = () => {
    const settings = useSettingsStore();
    const showNotification = useNotificationStore((state) => state.showNotification);
    const { t } = useTranslation();
    const form = useForm({ defaultValues: settings });

    useEffect(() => {
        form.reset(settings);
    }, [settings, form.reset]);
    
    const [isSaving, setIsSaving] = useState(false);

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        settings.setSettings(data);
        await updateTenantSettings({ ...data, tenantId: settings.tenantId, logoUrl: settings.logoUrl, faviconUrl: settings.faviconUrl });
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        setIsSaving(false);
        showNotification(t('settings.notifications.saved'));
        form.reset(data);
    };
    
    return { ...form, settings, isSaving, onSubmit };
};

const SaveBar: React.FC<{onSave: () => void, onReset: () => void, isDirty: boolean, isSaving: boolean}> = ({ onSave, onReset, isDirty, isSaving }) => {
    const { t } = useTranslation();
    const { primaryColor } = useSettingsStore();

    return (
        <div className="flex justify-between items-center pt-5 mt-6 border-t border-border-default">
            <div>
                <button type="button" onClick={onReset} className="text-red-500 hover:underline text-sm font-medium">
                    {t('settings.resetToDefaults')}
                </button>
            </div>
            <button type="button" onClick={onSave} disabled={!isDirty || isSaving} style={{backgroundColor: primaryColor}} className="text-white px-6 py-2 rounded-md hover:opacity-90 disabled:opacity-50 text-sm font-semibold">
                {isSaving ? t('settings.saving') : t('settings.saveChanges')}
            </button>
        </div>
    )
};

const BrandingSettings = () => {
    const { t } = useTranslation();
    const { register, handleSubmit, watch, formState: { isDirty }, settings, isSaving, onSubmit } = useSettingsForm();
    const livePrimaryColor = watch('primaryColor');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'faviconUrl') => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                settings.setSettings({ [field]: event.target?.result as string });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
     const handleReset = () => {
        if (window.confirm(t('settings.confirmReset'))) {
            settings.resetToDefaults();
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <SettingsCard title={t('settings.branding.title')} description="Customize your workspace's appearance.">
                <div className="space-y-4">
                    <div>
                         <label className="block text-sm font-medium">{t('settings.branding.appName')}</label>
                         <input {...register('appName')} className={baseInputClasses}/>
                    </div>
                    <div>
                         <label className="block text-sm font-medium">{t('settings.whitelabel.customDomain')}</label>
                         <input {...register('customDomain')} placeholder="e.g., app.yourcompany.com" className={baseInputClasses}/>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-background rounded-md flex items-center justify-center border border-border-default">
                               {settings.logoUrl ? <img src={settings.logoUrl} alt="logo" className="max-w-full max-h-full p-1" /> : <span className="text-gray-400 text-xs">{t('settings.branding.logo')}</span>}
                            </div>
                            <label htmlFor="logo-upload" className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90" style={{backgroundColor: livePrimaryColor}}>
                                {t('settings.branding.uploadLogo')}
                            </label>
                            <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logoUrl')} />
                        </div>
                         <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-background rounded-md flex items-center justify-center border border-border-default">
                               {settings.faviconUrl ? <img src={settings.faviconUrl} alt="favicon" className="max-w-full max-h-full p-1" /> : <span className="text-gray-400 text-xs">{t('settings.whitelabel.favicon')}</span>}
                            </div>
                            <label htmlFor="favicon-upload" className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90" style={{backgroundColor: livePrimaryColor}}>
                                {t('settings.whitelabel.uploadFavicon')}
                            </label>
                            <input id="favicon-upload" type="file" className="hidden" accept="image/x-icon,image/png,image/svg+xml" onChange={(e) => handleFileUpload(e, 'faviconUrl')} />
                        </div>
                    </div>
                     <div className="pt-4">
                        <h3 className="text-sm font-medium mb-2">{t('settings.branding.themeColors')}</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="flex items-center space-x-3">
                                 <input type="color" {...register('primaryColor')} className="w-10 h-10 rounded-md border-none cursor-pointer"/>
                                 <div>
                                     <label className="font-medium text-sm">{t('settings.branding.primary')}</label>
                                     <p className="text-xs text-text-secondary">{t('settings.branding.primaryDesc')}</p>
                                 </div>
                             </div>
                              <div className="flex items-center space-x-3">
                                 <input type="color" {...register('secondaryColor')} className="w-10 h-10 rounded-md border-none cursor-pointer"/>
                                 <div>
                                     <label className="font-medium text-sm">{t('settings.branding.secondary')}</label>
                                     <p className="text-xs text-text-secondary">{t('settings.branding.secondaryDesc')}</p>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </SettingsCard>

            <SettingsCard title={t('settings.whitelabel.emailTitle')} description={t('settings.whitelabel.emailDesc')}>
                 <div className="space-y-4">
                     <div>
                         <label className="block text-sm font-medium">{t('settings.whitelabel.emailHeader')}</label>
                         <textarea {...register('emailHeaderText')} rows={2} className={baseInputClasses}/>
                    </div>
                     <div>
                         <label className="block text-sm font-medium">{t('settings.whitelabel.emailFooter')}</label>
                         <textarea {...register('emailFooterText')} rows={2} className={baseInputClasses}/>
                    </div>
                 </div>
            </SettingsCard>
            <SaveBar onSave={handleSubmit(onSubmit)} onReset={handleReset} isDirty={isDirty} isSaving={isSaving} />
        </form>
    )
}

const GeneralSettings = () => {
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { isDirty }, isSaving, onSubmit, settings } = useSettingsForm();
    const handleReset = () => {
        if (window.confirm(t('settings.confirmReset'))) settings.resetToDefaults();
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <SettingsCard title={t('settings.general.title')} description="Manage your workspace's language and timezone.">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                         <label htmlFor="timezone" className="block text-sm font-medium">{t('settings.general.timezone')}</label>
                         <select id="timezone" {...register('timezone')} className={baseInputClasses}>
                            {timezones.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
                         </select>
                     </div>
                     <div>
                         <label htmlFor="language" className="block text-sm font-medium">{t('settings.general.language')}</label>
                         <select id="language" {...register('language')} className={baseInputClasses}>
                            {languages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                         </select>
                     </div>
                 </div>
            </SettingsCard>
            <SaveBar onSave={handleSubmit(onSubmit)} onReset={handleReset} isDirty={isDirty} isSaving={isSaving} />
        </form>
    );
}

const SecuritySettings = () => {
    const { t } = useTranslation();
    const { register, handleSubmit, control, setValue, formState: { isDirty }, isSaving, onSubmit, settings } = useSettingsForm();
    const showNotification = useNotificationStore((state) => state.showNotification);
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    
    const handle2FAToggle = (checked: boolean) => {
        if (checked) setIs2FAModalOpen(true);
        else setValue('enforce2FA', false, { shouldDirty: true });
    };

    const handleReset = () => {
        if (window.confirm(t('settings.confirmReset'))) settings.resetToDefaults();
    }
    
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <SettingsCard title={t('settings.security.title')} description="Configure security settings for your workspace.">
                     <div className="space-y-4">
                        <div>
                             <label htmlFor="sessionTimeout" className="block text-sm font-medium">{t('settings.security.sessionTimeout')}</label>
                             <input id="sessionTimeout" type="number" {...register('sessionTimeout', { valueAsNumber: true, min: 5 })} className={baseInputClasses}/>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <div>
                                <label className="block text-sm font-medium">{t('settings.security.enforce2FA')}</label>
                                <p className="text-xs text-text-secondary">{t('settings.security.enforce2FADesc')}</p>
                            </div>
                             <Controller
                                name="enforce2FA"
                                control={control}
                                render={({ field }) => <ToggleSwitch checked={field.value} onChange={handle2FAToggle} />}
                            />
                        </div>
                     </div>
                 </SettingsCard>
                <SaveBar onSave={handleSubmit(onSubmit)} onReset={handleReset} isDirty={isDirty} isSaving={isSaving} />
            </form>
            {is2FAModalOpen && (
                <TwoFactorAuthModal
                    onClose={() => setIs2FAModalOpen(false)}
                    onSuccess={() => {
                        setValue('enforce2FA', true, { shouldDirty: true });
                        setIs2FAModalOpen(false);
                        showNotification(t('settings.notifications.2faEnabled'));
                    }}
                />
            )}
        </>
    )
}

const NotificationSettings = () => {
    const { t } = useTranslation();
    const { control, handleSubmit, formState: { isDirty }, isSaving, onSubmit, settings } = useSettingsForm();
    const handleReset = () => {
        if (window.confirm(t('settings.confirmReset'))) settings.resetToDefaults();
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <SettingsCard title={t('settings.notifications.title')} description="Manage how your team receives notifications.">
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <div>
                          <label className="block text-sm font-medium">{t('settings.notifications.weeklySummary')}</label>
                          <p className="text-xs text-text-secondary">{t('settings.notifications.weeklySummaryDesc')}</p>
                      </div>
                      <Controller name="notifications.weeklySummary" control={control} render={({ field }) => <ToggleSwitch checked={field.value} onChange={field.onChange} />}/>
                   </div>
                   <div className="flex justify-between items-center pt-2 border-t border-border-default">
                      <div>
                          <label className="block text-sm font-medium">{t('settings.notifications.productUpdates')}</label>
                          <p className="text-xs text-text-secondary">{t('settings.notifications.productUpdatesDesc')}</p>
                      </div>
                       <Controller name="notifications.productUpdates" control={control} render={({ field }) => <ToggleSwitch checked={field.value} onChange={field.onChange} />}/>
                   </div>
                </div>
            </SettingsCard>
            <SaveBar onSave={handleSubmit(onSubmit)} onReset={handleReset} isDirty={isDirty} isSaving={isSaving} />
        </form>
    );
}

const Integrations = () => {
    const { t } = useTranslation();
    const { primaryColor } = useSettingsStore();
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    
    const integrationsList = [
        { name: 'Google Drive', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png', description: t('settings.integrations.gdriveDesc'), connected: true },
        { name: 'Dropbox', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dropbox_Icon.svg/240px-Dropbox_Icon.svg.png', description: t('settings.integrations.dropboxDesc'), connected: false },
        { name: 'Slack', logo: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg', description: t('settings.integrations.slackDesc'), connected: false },
    ];
    
    return (
        <>
        <SettingsCard title={t('settings.integrations.title')} description={t('settings.integrations.description')}>
            <div className="space-y-4">
                {integrationsList.map(integration => (
                    <div key={integration.name} className="flex items-center justify-between p-4 border border-border-default rounded-lg">
                        <div className="flex items-center gap-4">
                            <img src={integration.logo} alt={`${integration.name} logo`} className="w-10 h-10 object-contain"/>
                            <div>
                                <h3 className="font-semibold text-sm">{integration.name}</h3>
                                <p className="text-xs text-text-secondary">{integration.description}</p>
                            </div>
                        </div>
                        {integration.connected ? (
                            <button className="text-xs font-semibold text-green-600 px-3 py-1.5 rounded-md border border-green-200 bg-green-50 dark:bg-green-900/50 dark:border-green-800">
                                {t('settings.integrations.connected')}
                            </button>
                        ) : (
                            <button onClick={() => setIsWizardOpen(true)} style={{backgroundColor: primaryColor}} className="text-xs font-semibold text-white px-4 py-2 rounded-md hover:opacity-90">
                                {t('settings.integrations.connect')}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </SettingsCard>
        {isWizardOpen && <IntegrationWizard onClose={() => setIsWizardOpen(false)} />}
        </>
    );
};


export default Settings;