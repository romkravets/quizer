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
      <h2 className="text-2xl font-bold text-brand-dark">
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
      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-3 font-semibold text-brand-dark">
          {locale === 'uk' ? 'Прогрес по областях' : 'Region Progress'}
        </h3>
        <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-yellow to-brand-green transition-all duration-500"
            style={{ width: `${(completedRegions.length / regions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
          {completedRegions.length} {locale === 'uk' ? 'з' : 'of'} {regions.length}{' '}
          {locale === 'uk' ? 'областей досліджено' : 'regions explored'}
        </p>
      </div>

      {/* Badges */}
      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-3 font-semibold text-brand-dark">
          {locale === 'uk' ? '🏆 Досягнення' : '🏆 Achievements'} ({earnedBadges.length}/{totalBadges})
        </h3>
        {earnedBadges.length === 0 ? (
          <p className="text-sm text-gray-500">
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
                    'flex items-center gap-2 rounded-lg border-2 p-3',
                    badge.tier === 'bronze' && 'border-badge-bronze/30 bg-badge-bronze/5',
                    badge.tier === 'silver' && 'border-badge-silver/30 bg-badge-silver/5',
                    badge.tier === 'gold' && 'border-badge-gold/30 bg-badge-gold/5',
                    badge.tier === 'platinum' && 'border-badge-platinum/30 bg-badge-platinum/5'
                  )}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-brand-dark">
                      {locale === 'uk' ? badge.nameUk : badge.nameEn}
                    </p>
                    <p className="text-xs text-gray-500">
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
      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-3 font-semibold text-gray-400">
          {locale === 'uk' ? '🔒 Ще не здобуті' : '🔒 Not yet earned'}
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {BADGES.filter((b) => !progress.badges.includes(b.id))
            .slice(0, 8)
            .map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center rounded-lg bg-gray-50 p-2 opacity-40"
              >
                <span className="text-xl grayscale">{badge.icon}</span>
                <p className="mt-1 text-center text-xs text-gray-400">
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
    <div className="flex flex-col items-center rounded-xl bg-white p-4 shadow">
      <span className="mb-1 text-2xl">{icon}</span>
      <span className="text-xl font-bold text-brand-dark">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
