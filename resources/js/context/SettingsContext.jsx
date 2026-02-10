import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LocaleContext } from './LocaleContext';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const { locale } = useContext(LocaleContext);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // We use the current locale for the API call
                const response = await axios.get(`/api/${locale}/settings`);
                setSettings(response.data.data);
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setLoading(false);
            }
        };

        if (locale) {
            fetchSettings();
        }
    }, [locale]);

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
