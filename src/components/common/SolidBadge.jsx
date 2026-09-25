// src/components/common/SolidBadge.jsx
// Badge warna solid tanpa gradient dengan ukuran teks yang ringkas

import React from 'react';

export default function SolidBadge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-blue-900 text-blue-200 border-blue-700',
    success: 'bg-emerald-900 text-emerald-200 border-emerald-700',
    warning: 'bg-amber-900 text-amber-200 border-amber-700',
    danger: 'bg-rose-900 text-rose-200 border-rose-700',
    purple: 'bg-purple-900 text-purple-200 border-purple-700',
    cyan: 'bg-cyan-900 text-cyan-200 border-cyan-700'
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium border rounded-md ${currentVariant} ${className}`}>
      {children}
    </span>
  );
}
