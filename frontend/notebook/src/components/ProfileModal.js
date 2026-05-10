import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/axios';

const ProfileModal = ({ onClose, showToast }) => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('password'); // 'password' | 'delete'

  // ── Changer mot de passe ──────────────────────────────────────────────────
  const [pwForm, setPwForm]     = useState({ current_password: '', password: '', password_confirmation: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);

  const handlePwChange = (e) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
    setPwErrors({ ...pwErrors, [e.target.name]: '' });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    setPwErrors({});
    try {
      const { data } = await authAPI.changePassword(pwForm);
      // Mettre à jour le token
      localStorage.setItem('notebook_token', data.token);
      showToast('Mot de passe modifié avec succès ! 🔐');
      setPwForm({ current_password: '', password: '', password_confirmation: '' });
      onClose();
    } catch (err) {
      setPwErrors(err.response?.data?.errors || {});
      showToast(err.response?.data?.message || 'Erreur.', 'error');
    } finally {
      setPwLoading(false);
    }
  };

  // ── Supprimer compte ──────────────────────────────────────────────────────
  const [delPassword, setDelPassword] = useState('');
  const [delError, setDelError]       = useState('');
  const [delLoading, setDelLoading]   = useState(false);
  const [delConfirm, setDelConfirm]   = useState(false);

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDelLoading(true);
    setDelError('');
    try {
      await authAPI.deleteAccount({ password: delPassword });
      
      // Vider localStorage IMMÉDIATEMENT avant tout redirect
      localStorage.removeItem('notebook_token');
      localStorage.removeItem('notebook_user');
      
      // Attendre que localStorage soit vidé avant de recharger
      setTimeout(() => {
        window.location.replace('/login');
      }, 100);
      
    } catch (err) {
      setDelError(err.response?.data?.message || 'Mot de passe incorrect.');
      setDelLoading(false);
    }
  };

  const inputClass = (err) =>
    `w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white
    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all
    ${err ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">👤 Mon profil</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.name} · {user?.email}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setTab('password')}
            className={`flex-1 py-3 text-sm font-semibold transition-all
              ${tab === 'password' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
          >
            🔐 Mot de passe
          </button>
          <button
            onClick={() => setTab('delete')}
            className={`flex-1 py-3 text-sm font-semibold transition-all
              ${tab === 'delete' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
          >
            🗑️ Supprimer le compte
          </button>
        </div>

        <div className="p-6">
          {/* ── Tab : Changer mot de passe ─────────────────────────────────── */}
          {tab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mot de passe actuel</label>
                <input type="password" name="current_password" value={pwForm.current_password}
                  onChange={handlePwChange} placeholder="••••••••" required className={inputClass(pwErrors.current_password)}/>
                {pwErrors.current_password && <p className="text-red-500 text-xs mt-1">{pwErrors.current_password[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nouveau mot de passe</label>
                <input type="password" name="password" value={pwForm.password}
                  onChange={handlePwChange} placeholder="Min. 8 caractères" required className={inputClass(pwErrors.password)}/>
                {pwErrors.password && <p className="text-red-500 text-xs mt-1">{pwErrors.password[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirmer le nouveau mot de passe</label>
                <input type="password" name="password_confirmation" value={pwForm.password_confirmation}
                  onChange={handlePwChange} placeholder="••••••••" required className={inputClass(pwErrors.password_confirmation)}/>
                {pwErrors.password_confirmation && <p className="text-red-500 text-xs mt-1">{pwErrors.password_confirmation[0]}</p>}
              </div>

              <button type="submit" disabled={pwLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                {pwLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Modification...</> : 'Changer le mot de passe'}
              </button>
            </form>
          )}

          {/* ── Tab : Supprimer compte ─────────────────────────────────────── */}
          {tab === 'delete' && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">⚠️ Cette action est irréversible</p>
                <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                  Toutes vos notes, tags et données seront définitivement supprimés.
                </p>
              </div>

              {!delConfirm ? (
                <button
                  onClick={() => setDelConfirm(true)}
                  className="w-full py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-100 transition-all">
                  Je veux supprimer mon compte
                </button>
              ) : (
                <form onSubmit={handleDeleteAccount} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Confirmer avec votre mot de passe
                    </label>
                    <input type="password" value={delPassword} onChange={(e) => { setDelPassword(e.target.value); setDelError(''); }}
                      placeholder="Votre mot de passe" required className={inputClass(delError)}/>
                    {delError && <p className="text-red-500 text-xs mt-1">{delError}</p>}
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setDelConfirm(false)}
                      className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 font-semibold transition-all">
                      Annuler
                    </button>
                    <button type="submit" disabled={delLoading}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                      {delLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Suppression...</> : 'Supprimer définitivement'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
