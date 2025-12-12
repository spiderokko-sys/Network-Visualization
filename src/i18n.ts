import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import ru from './locales/ru.json';

const resources = {
    en: {
        translation: en
    },
    ru: {
        translation: ru
    }
};

i18n
    // Detects user language
    .use(LanguageDetector)
    // Passes i18n down to react-i18next
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en', // Use English if detected language is not available
        interpolation: {
            escapeValue: false // React already escapes values
        },
        detection: {
            order: ['navigator', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage']
        }
    });

export default i18n;
