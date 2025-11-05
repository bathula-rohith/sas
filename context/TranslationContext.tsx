import React, { createContext, useContext } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { en } from '../locales/en';
import { hi } from '../locales/hi';
import { te } from '../locales/te';
import { es } from '../locales/es';
import { fr } from '../locales/fr';
import { de } from '../locales/de';

type Translations = typeof en;
type Language = 'en' | 'hi' | 'te' | 'es' | 'fr' | 'de';

const translations: Record<Language, Translations> = {
    en,
    hi,
    te,
    es,
    fr,
    de
};

interface TranslationContextType {
    language: Language;
    t: (key: string, options?: Record<string, string | number>) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const getNestedValue = (obj: any, path: string): string | undefined => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { language } = useSettingsStore();
    const currentLang = (language in translations ? language : 'en') as Language;

    const t = (key: string, options?: Record<string, string | number>): string => {
        let translation = getNestedValue(translations[currentLang], key);

        if (!translation) {
            // Fallback to English if translation is missing
            translation = getNestedValue(translations.en, key);
        }

        if (!translation) {
            return key; // Return the key if no translation is found at all
        }

        if (options) {
            Object.keys(options).forEach(optionKey => {
                const regex = new RegExp(`{{${optionKey}}}`, 'g');
                translation = translation!.replace(regex, String(options[optionKey]));
            });
        }

        return translation;
    };

    return (
        <TranslationContext.Provider value={{ language: currentLang, t }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = (): TranslationContextType => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
};