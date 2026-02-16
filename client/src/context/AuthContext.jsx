import { createContext, useState, useEffect } from 'react';

// Create a Context for Authentication Logic
export const AuthContext = createContext();

// AuthProvider Component
// Manages the global authentication state (user & token)
// Persists login across refreshes using localStorage
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Check localStorage on mount/token change to sync state
    useEffect(() => {
        if (token) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            setUser(storedUser);
        }
    }, [token]);

    // Login Action: Saves token/user and updates state
    const login = (userData, userToken) => {
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(userToken);
        setUser(userData);
    };

    // Logout Action: Clears persistence and state
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};