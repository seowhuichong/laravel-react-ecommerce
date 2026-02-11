import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
    const { locale, switchLanguage } = useLocale();
    const location = useLocation();
    const navigate = useNavigate();

    const languages = [
        { code: 'en-MY', label: 'EN' },
        { code: 'ms-MY', label: 'BM' },
        { code: 'zh-CN', label: '中文' }
    ];

    const handleSwitch = (newLocale) => {
        if (newLocale === locale) return;

        const path = location.pathname;
        const pathWithoutLocale = path.replace(`/${locale}`, '') || '/';

        let finalPath = `/${newLocale}/${pathWithoutLocale}`;

        switchLanguage(newLocale);
        navigate(finalPath);
    };

    return (
        <div className="mt-8">
            <label className="block text-sm text-gray-400 mb-2">Language</label>
            <div className="relative inline-block">
                <select
                    value={locale}
                    onChange={(e) => handleSwitch(e.target.value)}
                    className="appearance-none bg-transparent border border-gray-700 rounded-full px-6 py-2 pr-10 text-sm text-white cursor-pointer hover:border-gray-600 transition-colors focus:outline-none focus:border-white"
                >
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code} className="bg-black">
                            {lang.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
};

export default LanguageSwitcher;