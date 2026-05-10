import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import NotesDashboard from './pages/NotesDashboard';
import './index.css';
import NoteList from './components/NoteList';

// ─── Route privée : redirige vers /login si non authentifié ─────────────────
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// ─── Route publique : redirige vers /dashboard si déjà connecté ─────────────
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return !user ? children : <Navigate to="/notes" replace />;
};

// ─── Composant racine avec tous les providers ────────────────────────────────
function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Redirection racine */}
        <Route path="/" element={<Navigate to="/notes" replace />} />

        {/* Routes publiques */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Routes privées */}
        <Route
          path="/notes"
          element={
            <PrivateRoute>
              <NotesDashboard/>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <NotesDashboard />
            </PrivateRoute>
          }
        />

        {/* Route 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
              <h1 className="text-6xl font-bold text-indigo-500 mb-4">404</h1>
              <p className="text-xl mb-8">Page introuvable</p>
              <a
                href="/notes"
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
              >
                Retour au notes
              </a>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

// ─── Export principal avec les providers imbriqués ──────────────────────────
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
