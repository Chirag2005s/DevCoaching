import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Check if token and user exist in local storage
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
    };

    const updateUserPurchaseStatus = (hasPurchased, newToken, enrollmentNumber, completedTopics) => {
        if (user) {
            const updatedUser = { ...user, hasPurchasedCourse: hasPurchased };
            if (enrollmentNumber) updatedUser.enrollmentNumber = enrollmentNumber;
            if (completedTopics) updatedUser.completedTopics = completedTopics;
            setUser(updatedUser);
            setToken(newToken);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            localStorage.setItem('token', newToken);
        }
    };

    const updateUserProgress = (completedTopics, newToken) => {
        if (user) {
            const updatedUser = { ...user, completedTopics };
            setUser(updatedUser);
            if (newToken) {
                setToken(newToken);
                localStorage.setItem('token', newToken);
            }
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUserPurchaseStatus, updateUserProgress }}>
            {children}
        </AuthContext.Provider>
    );
};
