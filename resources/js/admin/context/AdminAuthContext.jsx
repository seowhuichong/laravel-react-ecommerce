import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AdminAuthContext = createContext();

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                const res = await api.get('/api/admin/me');
                setAdmin(res.data.admin);
            } catch {
                localStorage.removeItem('admin_token');
                delete api.defaults.headers.common['Authorization'];
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const res = await api.post('/api/admin/login', { email, password });
        const { access_token, admin } = res.data;
        localStorage.setItem('admin_token', access_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        setAdmin(admin);
        return res.data;
    };

    const logout = async () => {
        try {
            await api.post('/api/admin/logout');
        } catch { /* token may have expired */ }
        localStorage.removeItem('admin_token');
        delete api.defaults.headers.common['Authorization'];
        setAdmin(null);
    };

    return (
        <AdminAuthContext.Provider value={{ admin, login, logout, loading, api }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const ctx = useContext(AdminAuthContext);
    if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
    return ctx;
};
