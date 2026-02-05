import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocaleContext } from '../context/LocaleContext';

const LanguageSwitcher = ({ availableSlugs, pathPattern }) => {
    const { locale, switchLanguage } = useContext(LocaleContext);
    const navigate = useNavigate();

    // Config for display names
    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'ms', label: 'BM' },
        { code: 'zh', label: '中文' }
    ];

    const handleSwitch = (newLocale) => {
        if (newLocale === locale) return;

        const targetSlug = availableSlugs?.[newLocale];

        // Build the path as an absolute string starting with /
        let finalPath = "";

        if (targetSlug && pathPattern) {
            // Remove leading/trailing slashes from pattern to control the join
            const cleanPattern = pathPattern
                .replace(':friendly_url', targetSlug)
                .replace(/^\/|\/$/g, '');

            finalPath = `/${newLocale}/${cleanPattern}`;
        } else {
            finalPath = `/${newLocale}`;
        }

        console.log("Navigating to:", finalPath); // Debug this!

        switchLanguage(newLocale);

        // The '/' at the start of finalPath is critical to prevent /en/ms/
        navigate(finalPath);
    };

    return (
        <div className="flex items-center gap-3 text-[12px] font-semibold tracking-wide">
            {languages.map((lang, index) => (
                <React.Fragment key={lang.code}>
                    <button
                        onClick={() => handleSwitch(lang.code)}
                        className={`transition-colors duration-200 ${locale === lang.code
                            ? 'text-green-600 underline underline-offset-4'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {lang.label}
                    </button>
                    {index < languages.length - 1 && (
                        <span className="text-gray-300 font-light">|</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default LanguageSwitcher;