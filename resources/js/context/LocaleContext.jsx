import React, { createContext, useEffect, useState, useContext } from 'react';

export const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
    const getLocaleFromUrl = () => {
        const path = window.location.pathname.split('/')[1];
        const supported = ['en-MY', 'ms-MY', 'zh-CN'];
        return supported.includes(path) ? path : 'en-MY';
    };

    const [locale, setLocale] = useState(getLocaleFromUrl());

    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    const switchLanguage = (newLocale) => {
        setLocale(newLocale);
    };

    return (
        <LocaleContext.Provider value={{ locale, switchLanguage }}>
            {children}
        </LocaleContext.Provider>
    );
};

export const useLocale = () => {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
};