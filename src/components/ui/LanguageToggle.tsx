'use client';

import type { Locale } from '@/types';

interface Props {
  locale: Locale;
  onToggle: () => void;
}

export default function LanguageToggle({ locale, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-white/60 transition-all hover:border-brand-yellow/60 hover:text-brand-yellow"
      title={locale === 'uk' ? 'Switch to English' : 'Перемкнути на українську'}
    >
      <span className="text-sm">{locale === 'uk' ? '🇺🇦' : '🇬🇧'}</span>
      <span>{locale === 'uk' ? 'UA' : 'EN'}</span>
    </button>
  );
}
