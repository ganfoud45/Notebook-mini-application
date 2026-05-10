import React, { createContext, useContext, useEffect, useState } from 'react';

// ─── Création du contexte ────────────────────────────────────────────────────
const ThemeContext = createContext(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export const ThemeProvider = ({ children }) => {
  // Lit la préférence sauvegardée ou détecte la préférence système
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('notebook_theme');
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // ── Applique la classe 'dark' sur <html> ─────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('notebook_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─── Hook personnalisé ───────────────────────────────────────────────────────
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider');
  }
  return context;
};

export default ThemeContext;
