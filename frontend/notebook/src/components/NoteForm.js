import React, { useEffect, useState } from 'react';

const PRIORITIES = [
  { value: 'basse',   label: '🟢 Basse',   style: 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
  { value: 'moyenne', label: '🟡 Moyenne',  style: 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
  { value: 'haute',   label: '🔴 Haute',    style: 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
];

const COLORS = [
  { value: '#ffffff', label: 'Défaut' },
  { value: '#fef3c7', label: 'Jaune'  },
  { value: '#dcfce7', label: 'Vert'   },
  { value: '#dbeafe', label: 'Bleu'   },
  { value: '#fce7f3', label: 'Rose'   },
  { value: '#f3e8ff', label: 'Violet' },
  { value: '#ffedd5', label: 'Orange' },
];

const NoteForm = ({ note, tags: existingTags = [], onSubmit, onClose }) => {
  const isEdit = !!note;

  const [form, setForm] = useState({
    title:     note?.title    || '',
    content:   note?.content  || '',
    priority:  note?.priority || 'basse',
    color:     note?.color    || '#ffffff',
    is_pinned: note?.is_pinned || false,
    tags:      note?.tags?.map(t => t.name) || [],
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const addTag = (name) => {
    const trimmed = name.trim().toLowerCase();
    if (trimmed && !form.tags.includes(trimmed) && form.tags.length < 5) {
      setForm({ ...form, tags: [...form.tags, trimmed] });
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const localErrors = {};
    if (!form.title.trim())   localErrors.title   = ['Le titre est obligatoire.'];
    if (!form.content.trim()) localErrors.content = ['Le contenu est obligatoire.'];
    if (Object.keys(localErrors).length > 0) { setErrors(localErrors); return; }

    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {isEdit ? '✏️ Modifier la note' : '✨ Nouvelle note'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Titre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Titre *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              placeholder="Titre de votre note..." autoFocus
              className={`w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all
                ${errors.title ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
          </div>

          {/* Contenu */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Contenu *</label>
            <textarea name="content" value={form.content} onChange={handleChange}
              placeholder="Écrivez votre note ici..." rows={5}
              className={`w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none
                ${errors.content ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
            />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content[0]}</p>}
          </div>

          {/* Priorité */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Priorité</label>
            <div className="flex gap-3">
              {PRIORITIES.map(({ value, label, style }) => (
                <label key={value} className="flex-1 cursor-pointer">
                  <input type="radio" name="priority" value={value} checked={form.priority === value} onChange={handleChange} className="sr-only"/>
                  <div className={`px-3 py-2 rounded-xl border-2 text-center text-sm font-semibold transition-all
                    ${form.priority === value ? style : 'border-gray-200 dark:border-gray-600 text-gray-400 hover:border-gray-300'}`}>
                    {label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Couleur */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🎨 Couleur de la note</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(({ value, label }) => (
                <button key={value} type="button" title={label}
                  onClick={() => setForm({ ...form, color: value })}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110
                    ${form.color === value ? 'border-indigo-500 scale-110 shadow-md' : 'border-gray-200 dark:border-gray-600'}`}
                  style={{ backgroundColor: value === '#ffffff' ? '#f9fafb' : value }}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              🏷️ Tags <span className="text-gray-400 font-normal">(max 5)</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-medium">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 ml-0.5">×</button>
                </span>
              ))}
            </div>
            {form.tags.length < 5 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Ajouter un tag (Entrée)"
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900
                    text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="button" onClick={() => addTag(tagInput)}
                  className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-medium hover:bg-indigo-200 transition-colors">
                  +
                </button>
              </div>
            )}
            {/* Tags existants suggérés */}
            {existingTags.filter(t => !form.tags.includes(t.name)).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {existingTags.filter(t => !form.tags.includes(t.name)).slice(0, 5).map(tag => (
                  <button key={tag.id} type="button" onClick={() => addTag(tag.name)}
                    className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    +{tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Épingler */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_pinned" checked={form.is_pinned} onChange={handleChange}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"/>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">📌 Épingler cette note</span>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-all">
              Annuler
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-md">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sauvegarde...</>
              ) : (isEdit ? 'Enregistrer' : 'Créer la note')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
