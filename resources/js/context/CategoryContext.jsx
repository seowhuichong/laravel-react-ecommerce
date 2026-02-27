import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocale } from './LocaleContext';

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
    const { locale } = useLocale();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Use a relative URL so it always hits the correct host (Laragon, artisan serve, etc.)
        fetch(`/api/${locale}/categories`)
            .then(res => res.json())
            .then(data => setCategories(data.categories ?? []))
            .catch(() => setCategories([]))
            .finally(() => setLoading(false));
    }, [locale]);

    return (
        <CategoryContext.Provider value={{ categories, loading }}>
            {children}
        </CategoryContext.Provider>
    );
}

export function useCategories() {
    const ctx = useContext(CategoryContext);
    if (!ctx) throw new Error('useCategories must be used within CategoryProvider');
    return ctx;
}
