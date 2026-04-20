'use client';

import { useProgress } from '@/hooks/useProgress';
import { BADGES, getBadgeById } from '@/lib/badges';
import { regions } from '@/helpers/regionType';
import clsx from 'clsx';

interface Props {
  locale?: 'uk' | 'en';
}

export default function ProgressDashboard({ locale = 'uk' }: Props) {
  const { progress, completedRegions, overallAccuracy } = useProgress();

  if (!progress) return null;

  const earnedBadges = progress.badges.map(getBadgeById).filter(Boolean);
  const totalBadges = BADGES.length;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <h2 className="text-2xl text-brand-dark">
        {locale === 'uk' ? '📊 Мій прогрес' : '📊 My Progress'}
      </h2>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon="📝"
          value={progress.totalQuizzesCompleted}
          label={locale === 'uk' ? 'Квізів пройдено' : 'Quizzes Done'}
        />
        <StatCard
          icon="🎯"
          value={`${overallAccuracy}%`}
          label={locale === 'uk' ? 'Точність' : 'Accuracy'}
        />
        <StatCard
          icon="🗺️"
          value={`${completedRegions.length}/${regions.length}`}
          label={locale === 'uk' ? 'Областей' : 'Regions'}
        />
        <StatCard
          icon="🔥"
          value={progress.streak}
          label={locale === 'uk' ? 'Серія днів' : 'Day Streak'}
        />
      </div>

      {/* Region progress bar */}
      <div className="bg-surface-cream p-4 shadow-golden-sm">
        <h3 className="mb-3 text-brand-dark">
          {locale === 'uk' ? 'Прогрес по областях' : 'Region Progress'}
        </h3>
        <div className="mb-2 h-3 w-full overflow-hidden bg-sunshine-300/40">
          <div
            className="h-full bg-gradient-to-r from-brand-orange to-brand-yellow transition-all duration-500"
            style={{ width: `${(completedRegions.length / regions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-brand-dark/50">
          {completedRegions.length} {locale === 'uk' ? 'з' : 'of'} {regions.length}{' '}
          {locale === 'uk' ? 'областей досліджено' : 'regions explored'}
        </p>
      </div>

      {/* Badges */}
      <div className="bg-surface-cream p-4 shadow-golden-sm">
        <h3 className="mb-3 text-brand-dark">
          {locale === 'uk' ? '🏆 Досягнення' : '🏆 Achievements'} ({earnedBadges.length}/{totalBadges})
        </h3>
        {earnedBadges.length === 0 ? (
          <p className="text-sm text-brand-dark/50">
            {locale === 'uk'
              ? 'Поки немає досягнень. Пройдіть свій перший квіз!'
              : 'No achievements yet. Complete your first quiz!'}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {earnedBadges.map((badge) =>
              badge ? (
                <div
                  key={badge.id}
                  className={clsx(
                    'flex items-center gap-2 border-2 p-3',
                    badge.tier === 'bronze' && 'border-badge-bronze/30 bg-badge-bronze/5',
                    badge.tier === 'silver' && 'border-badge-silver/30 bg-badge-silver/5',
                    badge.tier === 'gold' && 'border-badge-gold/30 bg-badge-gold/5',
                    badge.tier === 'platinum' && 'border-badge-platinum/30 bg-badge-platinum/5'
                  )}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <p className="text-sm text-brand-dark">
                      {locale === 'uk' ? badge.nameUk : badge.nameEn}
                    </p>
                    <p className="text-xs text-brand-dark/50">
                      {locale === 'uk' ? badge.descriptionUk : badge.descriptionEn}
                    </p>
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>

      {/* Locked badges preview */}
      <div className="bg-surface-cream p-4 shadow-golden-sm">
        <h3 className="mb-3 text-brand-dark/40">
          {locale === 'uk' ? '🔒 Ще не здобуті' : '🔒 Not yet earned'}
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {BADGES.filter((b) => !progress.badges.includes(b.id))
            .slice(0, 8)
            .map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center bg-sunshine-300/20 p-2 opacity-40"
              >
                <span className="text-xl grayscale">{badge.icon}</span>
                <p className="mt-1 text-center text-xs text-brand-dark/40">
                  {locale === 'uk' ? badge.nameUk : badge.nameEn}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center bg-surface-cream p-4 shadow-golden-sm">
      <span className="mb-1 text-2xl">{icon}</span>
      <span className="text-xl text-brand-dark">{value}</span>
      <span className="text-xs text-brand-dark/50">{label}</span>
    </div>
  );
}
