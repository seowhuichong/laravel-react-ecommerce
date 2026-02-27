import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Configure axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                const response = await axios.get('/api/me');
                setUser(response.data.user);
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('auth_token');
                delete axios.defaults.headers.common['Authorization'];
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const response = await axios.post('/api/login', { email, password });
        const { access_token, user } = response.data;

        localStorage.setItem('auth_token', access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        setUser(user);

        return response.data;
    };

    const register = async (userData) => {
        const response = await axios.post('/api/register', userData);
        const { access_token, user } = response.data;

        localStorage.setItem('auth_token', access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        setUser(user);

        return response.data;
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }

        localStorage.removeItem('auth_token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    // Merge updated fields into the current user object
    const updateUser = (updatedFields) => {
        setUser(prev => prev ? { ...prev, ...updatedFields } : prev);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}