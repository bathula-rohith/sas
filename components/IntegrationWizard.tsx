import React, { useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { useTranslation } from '../context/TranslationContext';
import { useNotificationStore } from '../store/notificationStore';

interface IntegrationWizardProps {
    onClose: () => void;
}

type Provider = 'gdrive' | 'dropbox' | 'onedrive';

interface FormData {
    provider: Provider | null;
    folder: string;
    syncFrequency: 'realtime' | 'daily' | 'weekly';
}

const IntegrationWizard: React.FC<IntegrationWizardProps> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        provider: null,
        folder: 'Colloki Backups',
        syncFrequency: 'daily',
    });
    const { primaryColor } = useSettingsStore();
    const { t } = useTranslation();
    const showNotification = useNotificationStore(state => state.showNotification);
    
    const totalSteps = 4;
    
    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const handleSelectProvider = (provider: Provider) => {
        setFormData({ ...formData, provider });
        nextStep();
    }
    
    const handleFinish = () => {
        // Simulate saving the integration
        console.log('Integration setup complete:', formData);
        showNotification(t('settings.integrations.wizard.successNotification'));
        onClose();
    }

    const isNextDisabled = (): boolean => {
        if (step === 3 && !formData.folder) return true;
        return false;
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-lg w-full max-w-2xl shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-border-default flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-text-primary">{t('settings.integrations.wizard.title')}</h3>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-2xl leading-none">&times;</button>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 overflow-auto space-y-6">
                    {/* Progress Bar */}
                    <div className="flex items-center">
                        <div className="flex-1">
                            <div className="w-full bg-background rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: `${(step / totalSteps) * 100}%`, backgroundColor: primaryColor }}></div>
                            </div>
                        </div>
                        <div className="ml-4 text-sm font-medium text-text-secondary">
                           {t('settings.integrations.wizard.step', { current: step, total: totalSteps })}
                        </div>
                    </div>
                    
                    {/* Step Content */}
                    <div>
                        {step === 1 && <Step1 onSelect={handleSelectProvider} />}
                        {step === 2 && <Step2 provider={formData.provider} onAuthSuccess={nextStep} />}
                        {step === 3 && <Step3 formData={formData} setFormData={setFormData} />}
                        {step === 4 && <Step4 formData={formData} />}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border-default flex justify-between items-center bg-background rounded-b-lg">
                    <button 
                        onClick={prevStep} 
                        disabled={step === 1}
                        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 text-sm font-medium disabled:opacity-50"
                    >
                        {t('settings.integrations.wizard.back')}
                    </button>
                    {step < totalSteps ? (
                         <button 
                            onClick={nextStep} 
                            disabled={isNextDisabled()}
                            style={{backgroundColor: primaryColor}} 
                            className="px-4 py-2 rounded text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
                        >
                            {t('settings.integrations.wizard.next')}
                        </button>
                    ) : (
                         <button 
                            onClick={handleFinish}
                            style={{backgroundColor: primaryColor}} 
                            className="px-4 py-2 rounded text-white text-sm font-medium hover:opacity-90"
                        >
                            {t('settings.integrations.wizard.finish')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const Step1 = ({ onSelect }: { onSelect: (provider: Provider) => void }) => {
    const { t } = useTranslation();
    const providers = [
        { id: 'gdrive', name: 'Google Drive', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png' },
        { id: 'dropbox', name: 'Dropbox', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dropbox_Icon.svg/240px-Dropbox_Icon.svg.png' },
        { id: 'onedrive', name: 'OneDrive', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Microsoft_OneDrive_logo.svg/230px-Microsoft_OneDrive_logo.svg.png' },
    ];
    return (
        <div>
            <h4 className="font-semibold text-center">{t('settings.integrations.wizard.step1.title')}</h4>
            <p className="text-sm text-center text-text-secondary mt-1">{t('settings.integrations.wizard.step1.desc')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {providers.map(p => (
                    <button key={p.id} onClick={() => onSelect(p.id as Provider)} className="p-4 border border-border-default rounded-lg hover:border-primary hover:bg-primary/5 text-center transition-all">
                        <img src={p.logo} alt={p.name} className="w-12 h-12 mx-auto object-contain"/>
                        <p className="font-medium text-sm mt-3">{p.name}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

const Step2 = ({ provider, onAuthSuccess }: { provider: Provider | null, onAuthSuccess: () => void }) => {
    const { t } = useTranslation();
    const { primaryColor } = useSettingsStore();
    const providerName = provider === 'gdrive' ? 'Google Drive' : provider === 'dropbox' ? 'Dropbox' : 'OneDrive';
    return (
         <div className="text-center">
            <h4 className="font-semibold">{t('settings.integrations.wizard.step2.title', { provider: providerName })}</h4>
            <p className="text-sm text-text-secondary mt-1">{t('settings.integrations.wizard.step2.desc', { provider: providerName })}</p>
            <button onClick={onAuthSuccess} style={{backgroundColor: primaryColor}} className="mt-6 mx-auto text-white px-6 py-2 rounded-md hover:opacity-90 text-sm font-semibold">
                {t('settings.integrations.wizard.step2.button')}
            </button>
        </div>
    )
};

const Step3 = ({ formData, setFormData }: { formData: FormData, setFormData: (data: FormData) => void }) => {
    const { t } = useTranslation();
    return (
         <div>
            <h4 className="font-semibold text-center">{t('settings.integrations.wizard.step3.title')}</h4>
            <p className="text-sm text-center text-text-secondary mt-1">{t('settings.integrations.wizard.step3.desc')}</p>
            <div className="mt-6 max-w-sm mx-auto space-y-4">
                <div>
                     <label className="block text-sm font-medium">{t('settings.integrations.wizard.step3.folderLabel')}</label>
                     <input 
                        type="text"
                        value={formData.folder}
                        onChange={(e) => setFormData({...formData, folder: e.target.value})}
                        className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium">{t('settings.integrations.wizard.step3.syncLabel')}</label>
                     <select 
                        value={formData.syncFrequency}
                        onChange={(e) => setFormData({...formData, syncFrequency: e.target.value as FormData['syncFrequency']})}
                        className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                    >
                        <option value="realtime">{t('settings.integrations.wizard.step3.syncRealtime')}</option>
                        <option value="daily">{t('settings.integrations.wizard.step3.syncDaily')}</option>
                        <option value="weekly">{t('settings.integrations.wizard.step3.syncWeekly')}</option>
                     </select>
                </div>
            </div>
        </div>
    )
};

const Step4 = ({ formData }: { formData: FormData }) => {
    const { t } = useTranslation();
    const providerName = formData.provider === 'gdrive' ? 'Google Drive' : formData.provider === 'dropbox' ? 'Dropbox' : 'OneDrive';

    return (
        <div className="text-center">
            <h4 className="font-semibold">{t('settings.integrations.wizard.step4.title')}</h4>
            <p className="text-sm text-text-secondary mt-1">{t('settings.integrations.wizard.step4.desc')}</p>
             <div className="mt-6 text-left max-w-sm mx-auto bg-background p-4 rounded-lg space-y-2 border border-border-default">
                 <div className="flex justify-between text-sm"><span className="text-text-secondary">{t('settings.integrations.wizard.step4.provider')}:</span> <span className="font-medium">{providerName}</span></div>
                 <div className="flex justify-between text-sm"><span className="text-text-secondary">{t('settings.integrations.wizard.step4.folder')}:</span> <span className="font-medium">{formData.folder}</span></div>
                 <div className="flex justify-between text-sm"><span className="text-text-secondary">{t('settings.integrations.wizard.step4.sync')}:</span> <span className="font-medium capitalize">{formData.syncFrequency}</span></div>
            </div>
        </div>
    )
};

export default IntegrationWizard;
