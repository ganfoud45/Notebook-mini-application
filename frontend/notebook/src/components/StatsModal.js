import React, { useEffect, useState } from 'react';
import { notesAPI } from '../api/axios';

const StatsModal = ({ onClose }) => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await notesAPI.getStats();
        setStats(data);
      } catch {} finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">📊 Statistiques</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : stats ? (
            <div className="space-y-6">

              {/* Chiffres clés */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Total notes',       value: stats.total,      emoji: '📝', color: 'indigo' },
                  { label: 'Modifiées aujourd\'hui', value: stats.today, emoji: '✏️', color: 'blue'   },
                  { label: 'Épinglées',          value: stats.pinned,     emoji: '📌', color: 'purple' },
                  { label: 'Tags créés',          value: stats.tags_count, emoji: '🏷️', color: 'pink'  },
                ].map(({ label, value, emoji, color }) => (
                  <div key={label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="text-2xl mb-1">{emoji}</div>
                    <div className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400`}>{value}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
                  </div>
                ))}
              </div>

              {/* Répartition par priorité */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Répartition par priorité</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Haute',   value: stats.by_priority.haute,   color: 'bg-red-500'   },
                    { label: 'Moyenne', value: stats.by_priority.moyenne, color: 'bg-amber-400' },
                    { label: 'Basse',   value: stats.by_priority.basse,   color: 'bg-green-500' },
                  ].map(({ label, value, color }) => {
                    const pct = stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>{label}</span>
                          <span>{value} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                          <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activité hebdomadaire */}
              {stats.weekly?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Activité des 7 derniers jours</h3>
                  <div className="flex items-end gap-1.5 h-20">
                    {(() => {
                      const days = [];
                      for (let i = 6; i >= 0; i--) {
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        const dateStr = d.toISOString().split('T')[0];
                        const found = stats.weekly.find(w => w.date === dateStr);
                        days.push({ date: dateStr, count: found ? found.count : 0, label: d.toLocaleDateString('fr-FR', { weekday: 'short' }) });
                      }
                      const max = Math.max(...days.map(d => d.count), 1);
                      return days.map(({ date, count, label }) => (
                        <div key={date} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-indigo-500 rounded-t-md transition-all duration-500 hover:bg-indigo-600"
                            style={{ height: `${(count / max) * 100}%`, minHeight: count > 0 ? '8px' : '2px', opacity: count > 0 ? 1 : 0.2 }}
                            title={`${count} note(s)`}
                          />
                          <span className="text-xs text-gray-400">{label}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Impossible de charger les statistiques.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
