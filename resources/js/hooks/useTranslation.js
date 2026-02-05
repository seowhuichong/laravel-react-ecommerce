import { useContext } from 'react';
import { LocaleContext } from '../context/LocaleContext';
import { translations } from '../lang/translations';

export const useTranslation = () => {
    const { locale } = useContext(LocaleContext);

    const t = (key) => {
        return translations[locale]?.[key] || translations['en']?.[key] || key;
    };

    return { t, locale };
};