import React from 'react';
import NoteCard from './NoteCard';

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 animate-pulse">
    <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4" />
    <div className="flex justify-between mb-4">
      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
    <div className="space-y-2">
      <div className="h-3 w-full bg-gray-100 dark:bg-gray-700/60 rounded" />
      <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-700/60 rounded" />
      <div className="h-3 w-4/6 bg-gray-100 dark:bg-gray-700/60 rounded" />
    </div>
  </div>
);

// ── État vide ─────────────────────────────────────────────────────────────────
const EmptyState = ({ hasSearch }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <svg className="w-40 h-40 mb-6 text-gray-200 dark:text-gray-700" viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="90" fill="currentColor" />
      <rect x="60" y="65" width="80" height="70" rx="10" fill="white" opacity="0.6"/>
      <rect x="72" y="82" width="45" height="6" rx="3" fill="white" opacity="0.8"/>
      <rect x="72" y="96" width="56" height="5" rx="2.5" fill="white" opacity="0.5"/>
      <rect x="72" y="108" width="40" height="5" rx="2.5" fill="white" opacity="0.5"/>
      {!hasSearch && (
        <circle cx="145" cy="145" r="22" fill="#6366f1"/>
      )}
      {!hasSearch && (
        <path d="M145 136 v18 M136 145 h18" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      )}
    </svg>
    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
      {hasSearch ? 'Aucun résultat trouvé' : 'Aucune note pour l\'instant'}
    </h3>
    <p className="text-gray-400 dark:text-gray-500 text-sm max-w-xs">
      {hasSearch
        ? 'Essayez d\'autres mots-clés ou modifiez votre recherche.'
        : 'Créez votre première note en cliquant sur "Nouvelle note".'}
    </p>
  </div>
);

// ── Composant principal ───────────────────────────────────────────────────────
const NoteList = ({ notes, loading, onEdit, onDelete, onTogglePin, onView }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="grid grid-cols-1">
        <EmptyState hasSearch={false} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePin={onTogglePin} 
          onView={onView} 
        />
      ))}
    </div>
  );
};

export default NoteList;
