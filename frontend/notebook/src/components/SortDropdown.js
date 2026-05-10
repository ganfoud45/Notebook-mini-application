import React from 'react';

const OPTIONS = [
  { value: 'recent',   label: '🕒 Date de modification' },
  { value: 'az',       label: '🔤 A → Z' },
  { value: 'za',       label: '🔤 Z → A' },
  { value: 'priority', label: '⚡ Priorité' },
];

const SortDropdown = ({ value, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-4 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium
        focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
    >
      {OPTIONS.map(({ value: v, label }) => (
        <option key={v} value={v}>{label}</option>
      ))}
    </select>
    <svg
      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
    </svg>
  </div>
);

export default SortDropdown;
