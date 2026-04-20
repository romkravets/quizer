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
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-dark transition-colors hover:bg-gray-50"
      title={locale === 'uk' ? 'Switch to English' : 'Перемкнути на українську'}
    >
      <span>{locale === 'uk' ? '🇺🇦' : '🇬🇧'}</span>
      <span>{locale === 'uk' ? 'UA' : 'EN'}</span>
    </button>
  );
}
