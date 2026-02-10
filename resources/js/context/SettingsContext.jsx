import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LocaleContext } from './LocaleContext';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const { locale } = useContext(LocaleContext);
    // Initialize with pre-loaded settings from window.AppConfig if available
    const [settings, setSettings] = useState(window.AppConfig?.settings || {});
    const [loading, setLoading] = useState(!window.AppConfig?.settings);

    useEffect(() => {
        // Only fetch settings if they weren't pre-loaded
        if (!window.AppConfig?.settings && locale) {
            const fetchSettings = async () => {
                try {
                    const response = await axios.get(`/api/${locale}/settings`);
                    setSettings(response.data.data);
                } catch (error) {
                    console.error('Failed to fetch settings:', error);
                } finally {
                    setLoading(false);
                }
            };

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
