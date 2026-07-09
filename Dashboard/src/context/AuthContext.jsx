import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('dc-token');
    const storedUser = localStorage.getItem('dc-user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('dc-token');
        localStorage.removeItem('dc-user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('dc-user', JSON.stringify(userData));
    localStorage.setItem('dc-token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dc-user');
    localStorage.removeItem('dc-token');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('dc-user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = !!token && !!user;
  const role = user?.role || null;

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated, role, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
