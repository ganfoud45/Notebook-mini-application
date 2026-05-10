import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '',
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null);

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
    setLoading(true);
    setErrors({});

    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
      showToast('Compte créé ! Connectez-vous.', 'success');
      localStorage.removeItem('notebook_token');
      localStorage.removeItem('notebook_user');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const apiErrors = err.response?.data?.errors || {};
      const message = err.response?.data?.message || "Erreur lors de l'inscription.";
      setErrors(apiErrors);
      showToast(message, 'error');
    } finally {
      setLoading(false); // ← c'était ça qui manquait
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all
    ${errors[field] ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Illustration gauche */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-indigo-700 items-center justify-center p-12">
        <div className="text-center text-white">
          <svg className="w-64 h-64 mx-auto mb-8 opacity-90" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="180" fill="rgba(255,255,255,0.08)" />
            <rect x="90" y="140" width="180" height="130" rx="14" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
            <rect x="100" y="125" width="180" height="130" rx="14" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
            <rect x="110" y="110" width="180" height="130" rx="14" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
            <rect x="130" y="138" width="100" height="10" rx="5" fill="rgba(255,255,255,0.7)"/>
            <rect x="130" y="158" width="140" height="7" rx="3.5" fill="rgba(255,255,255,0.4)"/>
            <rect x="130" y="174" width="120" height="7" rx="3.5" fill="rgba(255,255,255,0.4)"/>
            <rect x="130" y="190" width="80"  height="7" rx="3.5" fill="rgba(255,255,255,0.4)"/>
            <circle cx="290" cy="290" r="26" fill="rgba(167,139,250,0.9)"/>
            <path d="M290 280 v20 M280 290 h20" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
          </svg>
          <h2 className="text-4xl font-bold mb-4">Rejoignez-nous</h2>
          <p className="text-purple-200 text-lg leading-relaxed">
            Créez votre espace de notes<br />en quelques secondes.
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        {toast && (
          <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium
            ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
            {toast.message}
          </div>
        )}

        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <span className="text-4xl">📓</span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Notebook</h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Créer un compte ✨</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Commencez à organiser vos notes dès maintenant
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Nom */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jean Dupont"
                required
                className={inputClass('name')}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
            </div>

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
                className={inputClass('email')}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
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
                placeholder="Min. 8 caractères"
                required
                className={inputClass('password')}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
            </div>

            {/* Confirmation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className={inputClass('password_confirmation')}
              />
              {errors.password_confirmation && (
                <p className="text-red-500 text-xs mt-1">{errors.password_confirmation[0]}</p>
              )}
            </div>

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
                  Création du compte...
                </>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
