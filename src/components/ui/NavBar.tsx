'use client';

import Link from 'next/link';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
  showBack?: boolean;
  showProgress?: boolean;
  showLeaderboard?: boolean;
}

export default function NavBar({
  showBack = true,
  showProgress = true,
  showLeaderboard = true,
}: Props) {
  const { locale, toggleLocale, t } = useTranslation();

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark shadow-dark-lg">
      {/* Orange accent line at top */}
      <div className="h-[2px] w-full bg-fire-gradient" />

      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Left — logo + back */}
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl leading-none">🇺🇦</span>
            <span
              className="text-base font-semibold tracking-tight gradient-text"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {t('map.title')}
            </span>
          </Link>

          {showBack && (
            <Link
              href="/"
              className="hidden items-center gap-1 text-xs font-medium uppercase tracking-widest text-white/40 transition-colors hover:text-brand-yellow sm:flex"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('common.home')}
            </Link>
          )}
        </div>

        {/* Right — nav links + lang toggle */}
        <div className="flex items-center gap-2">
          {showProgress && (
            <Link
              href="/progress"
              className="hidden items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-white/60 transition-all hover:text-brand-yellow sm:flex"
            >
              <span className="text-sm">📊</span>
              {t('common.progress')}
            </Link>
          )}
          {showLeaderboard && (
            <Link
              href="/leaderboard"
              className="hidden items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-white/60 transition-all hover:text-brand-yellow sm:flex"
            >
              <span className="text-sm">🏆</span>
              {t('common.leaderboard')}
            </Link>
          )}
          <LanguageToggle locale={locale} onToggle={toggleLocale} />
        </div>
      </div>
    </nav>
  );
}
