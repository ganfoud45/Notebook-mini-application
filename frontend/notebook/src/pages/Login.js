import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null);

  // ── Affiche un toast temporaire ────────────────────────────────────────
  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrors({});

    try {
      await login(form.email, form.password);
      showToast('Connexion réussie !', 'success');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      const apiErrors = err.response?.data?.errors || {};
      const message   = err.response?.data?.message || 'Erreur de connexion.';
      setErrors(apiErrors);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* ── Illustration gauche (desktop) ────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center p-12">
        <div className="text-center text-white">
          {/* SVG illustration */}
          <svg className="w-64 h-64 mx-auto mb-8 opacity-90" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="180" fill="rgba(255,255,255,0.08)" />
            <rect x="100" y="120" width="200" height="160" rx="16" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
            <rect x="120" y="148" width="120" height="12" rx="6" fill="rgba(255,255,255,0.6)"/>
            <rect x="120" y="172" width="160" height="8" rx="4" fill="rgba(255,255,255,0.35)"/>
            <rect x="120" y="192" width="140" height="8" rx="4" fill="rgba(255,255,255,0.35)"/>
            <rect x="120" y="212" width="100" height="8" rx="4" fill="rgba(255,255,255,0.35)"/>
            <circle cx="270" cy="155" r="14" fill="rgba(167,139,250,0.8)"/>
            <path d="M264 155 l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 className="text-4xl font-bold mb-4">Notebook</h2>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Organisez vos idées,<br />capturez l'essentiel.
          </p>
        </div>
      </div>

      {/* ── Formulaire droite ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Bouton thème */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all duration-300
              ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
          >
            {toast.message}
          </div>
        )}

        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-4xl">📓</span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Your Notebook</h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bon retour !
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Connectez-vous à votre espace personnel
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="vous@exemple.com"
                required
                className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all
                  ${errors.email
                    ? 'border-red-400 dark:border-red-500'
                    : 'border-gray-200 dark:border-gray-700'
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all
                  ${errors.password
                    ? 'border-red-400 dark:border-red-500'
                    : 'border-gray-200 dark:border-gray-700'
                  }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>
              )}
            </div>

            {/* Bouton submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60
                text-white font-semibold rounded-xl transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Lien vers register */}
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm">
            Pas encore de compte ?{' '}
            <Link
              to="/register"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              S'inscrire gratuitement
            </Link>
          </p>

          
        </div>
      </div>
    </div>
  );
};

export default Login;
