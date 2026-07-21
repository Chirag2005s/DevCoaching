import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true; // Default to dark mode
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

    const toggleTheme = () => setIsDarkMode(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
