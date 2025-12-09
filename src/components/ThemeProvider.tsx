import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light' | 'system';
type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
    const [theme, setTheme] = useState<Theme>('dark');

    // Get system theme preference
    const getSystemTheme = (): Theme => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // Initialize theme from localStorage
    useEffect(() => {
        const savedThemeMode = localStorage.getItem('themeMode') as ThemeMode;
        if (savedThemeMode && ['dark', 'light', 'system'].includes(savedThemeMode)) {
            setThemeModeState(savedThemeMode);
        } else {
            setThemeModeState('system');
        }
    }, []);

    // Update actual theme when themeMode changes
    useEffect(() => {
        let actualTheme: Theme;

        if (themeMode === 'system') {
            actualTheme = getSystemTheme();
        } else {
            actualTheme = themeMode;
        }

        setTheme(actualTheme);
        localStorage.setItem('themeMode', themeMode);
    }, [themeMode]);

    // Listen for system theme changes when in system mode
    useEffect(() => {
        if (themeMode !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [themeMode]);

    // Apply theme to document
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const setThemeMode = (mode: ThemeMode) => {
        setThemeModeState(mode);
    };

    const toggleTheme = () => {
        setThemeModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
