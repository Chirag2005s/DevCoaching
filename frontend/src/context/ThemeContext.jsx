import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true; // Default to dark mode
    });

    const [palette, setPalette] = useState(() => {
        return localStorage.getItem('theme_palette') || 'ocean';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.setAttribute('data-theme', 'dark');
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
        } else {
            root.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        }
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-palette', palette);
        localStorage.setItem('theme_palette', palette);
    }, [palette]);

    const toggleTheme = () => setIsDarkMode(prev => !prev);
    const changePalette = (newPalette) => setPalette(newPalette);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, palette, changePalette }}>
            {children}
        </ThemeContext.Provider>
    );
};
