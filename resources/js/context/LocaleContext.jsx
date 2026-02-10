import React, { createContext, useEffect, useState, useContext } from 'react';

export const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
    const getLocaleFromUrl = () => {
        const path = window.location.pathname.split('/')[1];
        const supported = ['en', 'ms', 'zh'];
        return supported.includes(path) ? path : 'en';
    };

    const [locale, setLocale] = useState(getLocaleFromUrl());
    const [availableSlugs, setAvailableSlugs] = useState({});

    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    const switchLanguage = (newLocale) => {
        setLocale(newLocale);
    };

    return (
        <LocaleContext.Provider value={{ locale, availableSlugs, setAvailableSlugs, switchLanguage }}>
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