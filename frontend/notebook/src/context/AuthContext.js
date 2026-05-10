import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authAPI } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      const token = localStorage.getItem('notebook_token');
      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const { data } = await authAPI.me();
        if (!cancelled) setUser(data.user);
      } catch {
        localStorage.removeItem('notebook_token');
        localStorage.removeItem('notebook_user');
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkAuth();

    // Cleanup : si StrictMode remonte, annule le résultat
    return () => { cancelled = true; };
  }, []);

  const register = useCallback(async (name, email, password, password_confirmation) => {
    const { data } = await authAPI.register({ name, email, password, password_confirmation });
    return data;
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('notebook_token', data.token);
    localStorage.setItem('notebook_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch {}
    finally {
      localStorage.removeItem('notebook_token');
      localStorage.removeItem('notebook_user');
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return context;
};

export default AuthContext;
