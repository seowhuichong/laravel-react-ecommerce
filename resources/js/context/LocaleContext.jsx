import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
    const getLocaleFromUrl = () => {
        const path = window.location.pathname.split('/')[1];
        const supported = ['en', 'ms', 'zh'];
        return supported.includes(path) ? path : 'en';
    };

    const [locale, setLocale] = useState(getLocaleFromUrl());
    const [availableSlugs, setAvailableSlugs] = useState({});

    axios.defaults.headers.common['X-Locale'] = locale;

    useEffect(() => {
        axios.defaults.headers.common['X-Locale'] = locale;
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
