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

    const updateUserPurchaseStatus = (hasPurchased, newToken, enrollmentNumber) => {
        if (user) {
            const updatedUser = { ...user, hasPurchasedCourse: hasPurchased };
            if (enrollmentNumber) updatedUser.enrollmentNumber = enrollmentNumber;
            setUser(updatedUser);
            setToken(newToken);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            localStorage.setItem('token', newToken);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUserPurchaseStatus }}>
            {children}
        </AuthContext.Provider>
    );
};
