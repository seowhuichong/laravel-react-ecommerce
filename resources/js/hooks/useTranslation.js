import { useContext } from 'react';
import { useLocale } from '../context/LocaleContext';
import { translations } from '../lang/translations';

export const useTranslation = () => {
    const { locale } = useLocale();

    const t = (key) => {
        return translations[locale]?.[key] || translations['en']?.[key] || key;
    };

    return { t, locale };
};