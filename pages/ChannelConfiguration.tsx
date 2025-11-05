import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from '../context/TranslationContext';
import { useSettingsStore } from '../store/settingsStore';
import { useNotificationStore } from '../store/notificationStore';
import { ICONS } from '../constants';

type Channel = 'chat' | 'whatsapp';

interface FormData {
    channels: Channel[];
    branding: {
        primaryColor: string;
        headerText: string;
        avatarUrl: string | null;
    };
    whatsappConfig: {
        phoneNumber: string;
        apiToken: string;
    };
    flow: {
        apiKey: string;
        name: string;
    };
}

const ChannelConfiguration: React.FC = () => {
    const { t } = useTranslation();
    const { primaryColor } = useSettingsStore();
    const showNotification = useNotificationStore(state => state.showNotification);
    const [step, setStep] = useState(1);
    const [availableFlows, setAvailableFlows] = useState<string[]>([]);
    const [isFetchingFlows, setIsFetchingFlows] = useState(false);

    const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            channels: [],
            branding: { primaryColor: primaryColor, headerText: 'Chat with us!', avatarUrl: null },
            whatsappConfig: { phoneNumber: '', apiToken: '' },
            flow: { apiKey: '', name: '' },
        },
    });
    
    const watchedChannels = watch('channels');
    const watchedBranding = watch('branding');
    const totalSteps = 4;

    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleGetFlows = () => {
        setIsFetchingFlows(true);
        setTimeout(() => {
            setAvailableFlows(['Support Flow', 'Sales Inquiry Flow', 'Onboarding Assistant']);
            setIsFetchingFlows(false);
        }, 1000);
    };
    
    const onSubmit = (data: FormData) => {
        console.log('Final Configuration:', data);
        showNotification(t('channelConfiguration.successNotification'));
        // Here you would typically navigate away or show a success state on the page
    };

    return (
        <div className="bg-surface p-6 rounded-lg shadow max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">{t('channelConfiguration.title')}</h1>
            <p className="text-sm text-text-secondary mb-6">{t('channelConfiguration.description')}</p>
            
            {/* Progress Bar */}
            <div className="flex items-center mb-8">
                <div className="flex-1">
                    <div className="w-full bg-background rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%`, backgroundColor: primaryColor }}></div>
                    </div>
                </div>
                <div className="ml-4 text-sm font-medium text-text-secondary">
                   {t('channelConfiguration.step', { current: step, total: totalSteps })}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                {step === 1 && <Step1 control={control} />}
                {step === 2 && <Step2 control={control} channels={watchedChannels} />}
                {step === 3 && <Step3 control={control} availableFlows={availableFlows} isFetchingFlows={isFetchingFlows} onGetFlows={handleGetFlows} />}
                {step === 4 && <Step4 channels={watchedChannels} branding={watchedBranding} />}

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-border-default">
                    <button type="button" onClick={prevStep} disabled={step === 1} className="px-6 py-2 rounded bg-gray-200 dark:bg-gray-600 text-sm font-medium disabled:opacity-50">
                        {t('channelConfiguration.back')}
                    </button>
                    {step < totalSteps ? (
                         <button type="button" onClick={nextStep} style={{backgroundColor: primaryColor}} className="px-6 py-2 rounded text-white text-sm font-medium hover:opacity-90 disabled:opacity-50">
                            {t('channelConfiguration.next')}
                        </button>
                    ) : (
                         <button type="submit" style={{backgroundColor: primaryColor}} className="px-6 py-2 rounded text-white text-sm font-medium hover:opacity-90">
                            {t('channelConfiguration.finish')}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

// --- STEP 1: Channel Selection ---
const Step1 = ({ control }: { control: any }) => {
    const { t } = useTranslation();
    return (
        <div>
            <h2 className="text-lg font-semibold text-center">{t('channelConfiguration.step1.title')}</h2>
            <p className="text-sm text-center text-text-secondary mt-1">{t('channelConfiguration.step1.description')}</p>
            <Controller
                name="channels"
                control={control}
                render={({ field }) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-md mx-auto">
                        <ChannelCard
                            label={t('channelConfiguration.step1.chat')}
                            icon={ICONS.messageCircle}
                            isSelected={field.value.includes('chat')}
                            onToggle={() => {
                                const newValue = field.value.includes('chat') ? field.value.filter((c: Channel) => c !== 'chat') : [...field.value, 'chat'];
                                field.onChange(newValue);
                            }}
                        />
                        <ChannelCard
                            label={t('channelConfiguration.step1.whatsapp')}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>}
                            isSelected={field.value.includes('whatsapp')}
                             onToggle={() => {
                                const newValue = field.value.includes('whatsapp') ? field.value.filter((c: Channel) => c !== 'whatsapp') : [...field.value, 'whatsapp'];
                                field.onChange(newValue);
                            }}
                        />
                    </div>
                )}
            />
        </div>
    );
};

const ChannelCard = ({ label, icon, isSelected, onToggle }: { label: string, icon: React.ReactElement, isSelected: boolean, onToggle: () => void }) => {
    const { primaryColor } = useSettingsStore();
    return (
        <div 
            onClick={onToggle}
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all flex flex-col items-center justify-center text-center ${isSelected ? 'border-primary' : 'border-border-default hover:border-primary/50'}`}
            style={{borderColor: isSelected ? primaryColor : ''}}
        >
            <div className={`text-4xl mb-3 ${isSelected ? 'text-primary' : 'text-text-secondary'}`} style={{color: isSelected ? primaryColor : ''}}>{icon}</div>
            <p className="font-semibold">{label}</p>
        </div>
    );
};

// --- STEP 2: Configuration ---
const Step2 = ({ control, channels }: { control: any, channels: Channel[] }) => {
    const { t } = useTranslation();
    return (
        <div>
            <h2 className="text-lg font-semibold text-center">{t('channelConfiguration.step2.title')}</h2>
             <div className="mt-6 space-y-6 max-w-lg mx-auto">
                {channels.includes('chat') && <ChatBranding control={control} />}
                {channels.includes('whatsapp') && <WhatsAppConfig control={control} />}
             </div>
        </div>
    );
};

const ChatBranding = ({ control }: { control: any }) => {
    const { t } = useTranslation();
    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">{t('channelConfiguration.step2.brandingTitle')}</h3>
            <div className="space-y-4">
                <Controller name="branding.headerText" control={control} render={({ field }) => (
                    <div><label className="block text-sm font-medium">{t('channelConfiguration.step2.headerText')}</label><input {...field} className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"/></div>
                )} />
                <Controller name="branding.primaryColor" control={control} render={({ field }) => (
                    <div className="flex items-center space-x-3">
                         <input type="color" {...field} className="w-10 h-10"/>
                         <div>
                             <label className="font-medium text-sm">{t('channelConfiguration.step2.widgetColor')}</label>
                         </div>
                     </div>
                )} />
            </div>
        </div>
    );
}

const WhatsAppConfig = ({ control }: { control: any }) => {
    const { t } = useTranslation();
    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">{t('channelConfiguration.step2.whatsappTitle')}</h3>
            <div className="space-y-4">
                 <Controller name="whatsappConfig.phoneNumber" control={control} render={({ field }) => (
                    <div><label className="block text-sm font-medium">{t('channelConfiguration.step2.phoneNumber')}</label><input {...field} placeholder="+1234567890" className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"/></div>
                )} />
                 <Controller name="whatsappConfig.apiToken" control={control} render={({ field }) => (
                    <div><label className="block text-sm font-medium">{t('channelConfiguration.step2.apiToken')}</label><input {...field} type="password" className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"/></div>
                )} />
            </div>
        </div>
    );
}

// --- STEP 3: Flow Setup ---
const Step3 = ({ control, availableFlows, isFetchingFlows, onGetFlows }: { control: any, availableFlows: string[], isFetchingFlows: boolean, onGetFlows: () => void }) => {
    const { t } = useTranslation();
    return (
        <div>
            <h2 className="text-lg font-semibold text-center">{t('channelConfiguration.step3.title')}</h2>
            <p className="text-sm text-center text-text-secondary mt-1">{t('channelConfiguration.step3.description')}</p>
             <div className="mt-6 max-w-lg mx-auto space-y-4">
                <div>
                     <label className="block text-sm font-medium">{t('channelConfiguration.step3.apiKey')}</label>
                     <div className="flex gap-2">
                        <Controller name="flow.apiKey" control={control} render={({ field }) => <input {...field} type="password" className="flex-1 mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"/>} />
                        <button type="button" onClick={onGetFlows} disabled={isFetchingFlows} className="mt-1 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 text-sm font-medium disabled:opacity-50">
                            {isFetchingFlows ? t('channelConfiguration.step3.gettingFlows') : t('channelConfiguration.step3.getFlows')}
                        </button>
                     </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium">{t('channelConfiguration.step3.flowName')}</label>
                    <Controller name="flow.name" control={control} render={({ field }) => (
                        <select {...field} disabled={availableFlows.length === 0} className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm disabled:bg-gray-100 dark:disabled:bg-gray-800">
                             <option value="">{t('channelConfiguration.step3.selectFlow')}</option>
                             {availableFlows.map(flow => <option key={flow} value={flow}>{flow}</option>)}
                        </select>
                    )}/>
                 </div>
            </div>
        </div>
    );
};

// --- STEP 4: Preview ---
const Step4 = ({ channels, branding }: { channels: Channel[], branding: FormData['branding'] }) => {
    const { t } = useTranslation();
    return (
         <div>
            <h2 className="text-lg font-semibold text-center">{t('channelConfiguration.step4.title')}</h2>
            <p className="text-sm text-center text-text-secondary mt-1">{t('channelConfiguration.step4.description')}</p>
             <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                 {channels.includes('chat') && <ChatPreview branding={branding} />}
                 {channels.includes('whatsapp') && <WhatsAppPreview />}
            </div>
        </div>
    );
};

const ChatPreview = ({ branding }: { branding: FormData['branding'] }) => {
    const { t } = useTranslation();
    return (
        <div className="w-full">
            <h3 className="font-semibold text-center mb-2">{t('channelConfiguration.step4.chatPreviewTitle')}</h3>
            <div className="w-72 h-96 mx-auto rounded-lg shadow-lg flex flex-col bg-white dark:bg-gray-800 border dark:border-gray-700">
                <div className="p-3 text-white rounded-t-lg flex items-center space-x-2" style={{ backgroundColor: branding.primaryColor }}>
                    <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">{ICONS.messageCircle}</div>
                    <h4 className="font-bold text-sm">{branding.headerText}</h4>
                </div>
                <div className="p-4 flex-1 text-sm space-y-3">
                    <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg max-w-[80%]">Hi there! How can I help you today?</div>
                    <div className="flex justify-end">
                        <div className="text-white p-2 rounded-lg max-w-[80%]" style={{ backgroundColor: branding.primaryColor }}>I have a question about my account.</div>
                    </div>
                </div>
                <div className="p-2 border-t dark:border-gray-700 text-xs text-gray-400">Type your message...</div>
            </div>
        </div>
    );
}

const WhatsAppPreview = () => {
    const { t } = useTranslation();
    return (
        <div className="w-full">
            <h3 className="font-semibold text-center mb-2">{t('channelConfiguration.step4.whatsappPreviewTitle')}</h3>
            <div className="w-72 h-96 mx-auto rounded-lg shadow-lg flex flex-col bg-[#E5DDD5] dark:bg-gray-800 border dark:border-gray-700">
                <div className="p-2 bg-[#075E54] text-white flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">{ICONS.users}</div>
                    <h4 className="font-bold text-sm">Support Bot</h4>
                </div>
                <div className="p-4 flex-1 text-sm space-y-3">
                    <div className="bg-white dark:bg-gray-700 p-2 rounded-lg max-w-[80%] shadow">Hello! Thank you for contacting us.</div>
                </div>
            </div>
        </div>
    );
}

export default ChannelConfiguration;
