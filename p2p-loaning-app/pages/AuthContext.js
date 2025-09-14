import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try to fetch user info from /api/auth/me if JWT is present
        const token = localStorage.getItem('token');
        if (token) {
            fetch('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    setUser(data?.user || null);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw new Error('Login failed');
        const { user, token } = await res.json();
        localStorage.setItem('token', token);
        setUser(user);
        return user;
    };

    const register = async (email, password) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw new Error('Registration failed');
        return await login(email, password);
    };

    const logout = async () => {
        localStorage.removeItem('token');
        setUser(null);
        await fetch('/api/auth/logout', { method: 'POST' });
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}


export default AuthContext;