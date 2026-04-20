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
    <nav className="sticky top-0 z-50 border-b border-sunshine-300/40 bg-surface-cream/90 px-4 py-3 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-brand-dark transition-colors hover:text-brand-orange"
            >
              ← {t('common.home')}
            </Link>
          )}
          <Link href="/" className="text-lg text-brand-dark">
            🇺🇦 {t('map.title')}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {showProgress && (
            <Link
              href="/progress"
              className="hidden text-sm text-brand-dark transition-colors hover:text-brand-orange sm:inline"
            >
              📊 {t('common.progress')}
            </Link>
          )}
          {showLeaderboard && (
            <Link
              href="/leaderboard"
              className="hidden text-sm text-brand-dark transition-colors hover:text-brand-orange sm:inline"
            >
              🏆 {t('common.leaderboard')}
            </Link>
          )}
          <LanguageToggle locale={locale} onToggle={toggleLocale} />
        </div>
      </div>
    </nav>
  );
}
