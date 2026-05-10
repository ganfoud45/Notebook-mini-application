import React from 'react';

const PRIORITY_CONFIG = {
  haute:   { label: 'Haute',   bg: 'bg-red-100 dark:bg-red-900/40',    text: 'text-red-700 dark:text-red-400',    bar: 'bg-red-500'   },
  moyenne: { label: 'Moyenne', bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-400', bar: 'bg-amber-400' },
  basse:   { label: 'Basse',   bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-400', bar: 'bg-green-500' },
};

const formatDate = (d) => {
  const date = new Date(d);
  const diff = Math.floor((new Date() - date) / 1000);
  if (diff < 60)     return "À l'instant";
  if (diff < 3600)   return `Il y a ${Math.floor(diff/60)} min`;
  if (diff < 86400)  return `Il y a ${Math.floor(diff/3600)} h`;
  if (diff < 604800) return `Il y a ${Math.floor(diff/86400)} j`;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
};

const NoteCard = ({ note, onEdit, onDelete, onTogglePin, onView }) => {
  const priority = PRIORITY_CONFIG[note.priority] || PRIORITY_CONFIG.basse;

  // Couleur de fond personnalisée
  const bgStyle = note.color && note.color !== '#ffffff'
    ? { backgroundColor: note.color + '22' } // 22 = 13% opacité
    : {};

  return (
    <div
  className="group bg-white dark:bg-gray-800 rounded-2xl ..."
  style={note.color && note.color !== '#ffffff' ? { backgroundColor: note.color + '22' } : {}}
>
      {/* Barre couleur priorité */}
      <div className={`h-1 w-full ${priority.bar}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${priority.bg} ${priority.text}`}>
            {priority.label}
          </span>
          <div className="flex items-center gap-1">
            {note.is_pinned && <span className="text-sm">📌</span>}
            <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(note.updated_at)}</span>
          </div>
        </div>

        {/* Couleur dot */}
        {note.color && note.color !== '#ffffff' && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: note.color }} />
            <span className="text-xs text-gray-400">Couleur personnalisée</span>
          </div>
        )}

        {/* Titre */}
        <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2 line-clamp-2 leading-snug">
          {note.title}
        </h3>

        {/* Contenu */}
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1 whitespace-pre-line">
          {note.content}
        </p>

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {note.tags.map(tag => (
              <span key={tag.id} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-medium">
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/50
          opacity-0 group-hover:opacity-100 transition-opacity duration-200">

          {/* Épingler */}
          <button
            onClick={(e) => { e.stopPropagation(); onTogglePin(note); }}
            title={note.is_pinned ? 'Désépingler' : 'Épingler'}
            className={`p-1.5 rounded-lg transition-colors
              ${note.is_pinned
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`}
          >
            <svg className="w-4 h-4" fill={note.is_pinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
          </button>

          {/* Modifier */}
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(note); }}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl
              text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30
              hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors text-xs font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Modifier
          </button>

          {/* Supprimer */}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note); }}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl
              text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30
              hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-xs font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
