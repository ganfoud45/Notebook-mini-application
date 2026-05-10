import React, { useCallback, useEffect, useState } from 'react';
import { notesAPI, authAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';
import SearchBar from '../components/SearchBar';
import SortDropdown from '../components/SortDropdown';
import ConfirmModal from '../components/ConfirmModal';
import StatsModal from '../components/StatsModal';
import ProfileModal from '../components/ProfileModal';

const NotesDashboard = () => {
  const { user } = useAuth();

  const [notes, setNotes]             = useState([]);
  const [stats, setStats]             = useState({ total: 0, haute: 0, moyenne: 0, basse: 0, pinned: 0 });
  const [pagination, setPagination]   = useState({ current_page: 1, last_page: 1, total: 0 });
  const [tags, setTags]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption]   = useState('recent');
  const [activeTag, setActiveTag]     = useState('');
  const [page, setPage]               = useState(1);
  const [showForm, setShowForm]       = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showStats, setShowStats]     = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [viewNote, setViewNote]       = useState(null);
  const [toast, setToast]             = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Charger les notes ──────────────────────────────────────────────────────
  const fetchNotes = useCallback(async (p = 1) => {
    try {
      setLoading(true);
      const { data } = await notesAPI.getAll({ page: p, tag: activeTag ,sort:sortOption});
      setNotes(data.notes);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch {
      showToast('Impossible de charger les notes.', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTag,sortOption, showToast]);

  // ── Charger les tags ───────────────────────────────────────────────────────
  const fetchTags = useCallback(async () => {
    try {
      const { data } = await authAPI.getTags();
      setTags(data.tags);
    } catch {}
  }, []);

  useEffect(() => {
    fetchNotes(1);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, activeTag,sortOption]);

  useEffect(() => { fetchTags(); }, [fetchTags]);

  // ── Filtrage + tri local ───────────────────────────────────────────────────
  const filteredNotes = notes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    // Notes épinglées toujours en premier
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;

    const rank = { haute: 3, moyenne: 2, basse: 1 };
    if (sortOption === 'az')       return a.title.localeCompare(b.title);
    if (sortOption === 'za')       return b.title.localeCompare(a.title);
    if (sortOption === 'priority') return rank[b.priority] - rank[a.priority];
    return new Date(b.updated_at) - new Date(a.updated_at);
  });
  

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSubmitNote = async (formData) => {
    try {
      if (editingNote) {
        await notesAPI.update(editingNote.id, formData);
        showToast('Note mise à jour ! ✏️');
      } else {
        await notesAPI.create(formData);
        showToast('Note créée ! 🎉');
      }
      setShowForm(false);
      setEditingNote(null);
      await fetchNotes(page);
      await fetchTags();
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur.', 'error');
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await notesAPI.delete(deleteTarget.id);
      showToast('Note supprimée. 🗑️');
      setDeleteTarget(null);
      await fetchNotes(page);
      await fetchTags(); 
    } catch {
      showToast('Impossible de supprimer.', 'error');
    }
  };

  const handleTogglePin = async (note) => {
    try {
      await notesAPI.togglePin(note.id);
      showToast(note.is_pinned ? 'Note désépinglée.' : 'Note épinglée ! 📌');
      await fetchNotes(page);
    } catch {
      showToast('Erreur.', 'error');
    }
  };

  const handlePageChange = (p) => {
    setPage(p);
    fetchNotes(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar
        onNewNote={() => { setEditingNote(null); setShowForm(true); }}
        onShowStats={() => setShowStats(true)}
        onShowProfile={() => setShowProfile(true)}
      />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium
          transition-all duration-300 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Stats ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total',    value: stats.total,   emoji: '📝', color: 'indigo' },
            { label: 'Haute',    value: stats.haute,   emoji: '🔴', color: 'red'    },
            { label: 'Moyenne',  value: stats.moyenne, emoji: '🟡', color: 'amber'  },
            { label: 'Basse',    value: stats.basse,   emoji: '🟢', color: 'green'  },
            { label: 'Épinglées',value: stats.pinned,  emoji: '📌', color: 'purple' },
          ].map(({ label, value, emoji, color }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-xl mb-1">{emoji}</div>
              <div className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>{value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Tags filter ───────────────────────────────────────────────────── */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setActiveTag('')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                ${activeTag === '' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-50'}`}
            >
              Tous
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setActiveTag(tag.name)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                  ${activeTag === tag.name ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-50'}`}
              >
                #{tag.name} ({tag.notes_count})
              </button>
            ))}
          </div>
        )}

        {/* ── Recherche + tri ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <SortDropdown value={sortOption} onChange={setSortOption} />
        </div>

        {/* ── Liste ─────────────────────────────────────────────────────────── */}
        <NoteList
          notes={sortedNotes}
          loading={loading}
          onEdit={(note) => { setEditingNote(note); setShowForm(true); }}
          onDelete={(note) => setDeleteTarget(note)}
          onTogglePin={handleTogglePin}
          onView={(note) => setViewNote(note)}
        />

        {/* ── Pagination ────────────────────────────────────────────────────── */}
        {pagination.last_page > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all
                  ${p === pagination.current_page
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-400'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ────────────────────────────────────────────────────────────── */}
      {showForm && (
        <NoteForm
          note={editingNote}
          tags={tags}
          onSubmit={handleSubmitNote}
          onClose={() => { setShowForm(false); setEditingNote(null); }}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Supprimer la note ?"
          message={`La note "${deleteTarget.title}" sera supprimée définitivement.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {showStats && <StatsModal onClose={() => setShowStats(false)} />}

      {showProfile && (
        <ProfileModal
          onClose={() => setShowProfile(false)}
          showToast={showToast}
        />
      )}

      {/* ── Mode lecture ──────────────────────────────────────────────────────── */}
      {viewNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setViewNote(null); }}
        >
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className={`h-2 w-full ${
              viewNote.priority === 'haute' ? 'bg-red-500' :
              viewNote.priority === 'moyenne' ? 'bg-amber-400' : 'bg-green-500'}`}
            />
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{viewNote.title}</h2>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${viewNote.priority === 'haute' ? 'bg-red-100 text-red-700' :
                        viewNote.priority === 'moyenne' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'}`}>
                      {viewNote.priority}
                    </span>
                    {viewNote.is_pinned && <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">📌 Épinglée</span>}
                    {viewNote.tags?.map(tag => (
                      <span key={tag.id} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
                <button onClick={() => setViewNote(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed text-base">
                {viewNote.content}
              </p>
              <p className="text-xs text-gray-400 mt-6">
                Modifié le {new Date(viewNote.updated_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesDashboard;
