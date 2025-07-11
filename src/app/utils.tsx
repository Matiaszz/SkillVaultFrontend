'use client';
import { useEffect, useState } from "react";

const useTheme = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>('light');

    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
        mediaQuery.addEventListener('change', handler);

        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return theme;
};

export { useTheme };