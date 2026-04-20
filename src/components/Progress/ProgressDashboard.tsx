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
  const pct = Math.round((completedRegions.length / regions.length) * 100);

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4 animate-fade-in">

      {/* ── Page title ── */}
      <div className="pt-2">
        <h2 className="text-2xl font-semibold text-brand-dark">
          {locale === 'uk' ? 'Мій прогрес' : 'My Progress'}
        </h2>
        <p className="mt-1 text-sm text-brand-dark/40">
          {locale === 'uk'
            ? `${completedRegions.length} з ${regions.length} областей досліджено`
            : `${completedRegions.length} of ${regions.length} regions explored`}
        </p>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon="📝"
          value={progress.totalQuizzesCompleted}
          label={locale === 'uk' ? 'Квізів' : 'Quizzes'}
          accent="orange"
        />
        <StatCard
          icon="🎯"
          value={`${overallAccuracy}%`}
          label={locale === 'uk' ? 'Точність' : 'Accuracy'}
          accent="gold"
        />
        <StatCard
          icon="🗺️"
          value={`${completedRegions.length}/${regions.length}`}
          label={locale === 'uk' ? 'Областей' : 'Regions'}
          accent="orange"
        />
        <StatCard
          icon="🔥"
          value={progress.streak}
          label={locale === 'uk' ? 'Серія' : 'Streak'}
          accent="gold"
        />
      </div>

      {/* ── Region progress bar ── */}
      <div className="bg-white border border-sunshine-300/40 p-5 shadow-golden-sm">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-dark/60">
            {locale === 'uk' ? 'Прогрес по областях' : 'Region Progress'}
          </h3>
          <span className="font-mono text-xl font-semibold text-brand-orange">
            {pct}%
          </span>
        </div>
        <div className="relative h-2.5 w-full overflow-hidden bg-sunshine-300/30">
          <div
            className="absolute inset-y-0 left-0 bg-fire-gradient transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Tick marks */}
        <div className="mt-1.5 flex justify-between">
          {[0, 25, 50, 75, 100].map((v) => (
            <span key={v} className="text-[10px] text-brand-dark/25 tabular-nums">
              {v}%
            </span>
          ))}
        </div>
      </div>

      {/* ── Earned badges ── */}
      <div className="bg-white border border-sunshine-300/40 p-5 shadow-golden-sm">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-dark/60">
            {locale === 'uk' ? 'Досягнення' : 'Achievements'}
          </h3>
          <span className="text-xs text-brand-dark/40">
            {earnedBadges.length}/{totalBadges}
          </span>
        </div>

        {earnedBadges.length === 0 ? (
          <p className="text-sm text-brand-dark/40">
            {locale === 'uk'
              ? 'Поки немає досягнень. Пройдіть свій перший квіз!'
              : 'No achievements yet. Complete your first quiz!'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {earnedBadges.map((badge) =>
              badge ? (
                <div
                  key={badge.id}
                  className={clsx(
                    'flex items-center gap-3 border-l-4 px-3 py-2.5 transition-all hover:shadow-golden-sm',
                    badge.tier === 'bronze' && 'border-badge-bronze bg-badge-bronze/5',
                    badge.tier === 'silver' && 'border-badge-silver bg-badge-silver/5',
                    badge.tier === 'gold' && 'border-badge-gold bg-badge-gold/5',
                    badge.tier === 'platinum' && 'border-badge-platinum bg-badge-platinum/5'
                  )}
                >
                  <span className="shrink-0 text-2xl">{badge.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-brand-dark">
                      {locale === 'uk' ? badge.nameUk : badge.nameEn}
                    </p>
                    <p className="text-xs text-brand-dark/45">
                      {locale === 'uk' ? badge.descriptionUk : badge.descriptionEn}
                    </p>
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>

      {/* ── Locked badges preview ── */}
      {BADGES.filter((b) => !progress.badges.includes(b.id)).length > 0 && (
        <div className="bg-white border border-sunshine-300/40 p-5 shadow-golden-sm">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-dark/30">
            {locale === 'uk' ? 'Ще не здобуті' : 'Not yet earned'}
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {BADGES.filter((b) => !progress.badges.includes(b.id))
              .slice(0, 8)
              .map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center bg-surface-ivory p-2.5 opacity-35"
                >
                  <span className="text-xl grayscale">{badge.icon}</span>
                  <p className="mt-1.5 text-center text-[10px] font-medium uppercase tracking-wide text-brand-dark/40">
                    {locale === 'uk' ? badge.nameUk : badge.nameEn}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  accent,
}: {
  icon: string;
  value: string | number;
  label: string;
  accent: 'orange' | 'gold';
}) {
  return (
    <div className="group relative overflow-hidden bg-white border border-sunshine-300/40 p-4 shadow-golden-sm transition-all duration-250 hover:shadow-golden hover:-translate-y-0.5">
      {/* Accent bar at bottom */}
      <div
        className={clsx(
          'absolute inset-x-0 bottom-0 h-0.5',
          accent === 'orange' ? 'bg-brand-orange' : 'bg-brand-yellow'
        )}
      />
      <span className="mb-2 block text-2xl">{icon}</span>
      <span
        className={clsx(
          'block font-mono text-2xl font-semibold leading-none',
          accent === 'orange' ? 'text-brand-orange' : 'text-sunshine-900'
        )}
      >
        {value}
      </span>
      <span className="mt-1 block text-[11px] font-medium uppercase tracking-wider text-brand-dark/40">
        {label}
      </span>
    </div>
  );
}
