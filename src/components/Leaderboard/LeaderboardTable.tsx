'use client';

import { useState, useEffect } from 'react';
import { ref, get, child, set } from 'firebase/database';
import { db } from '@/components/db/firebase';
import type { LeaderboardEntry } from '@/types';
import clsx from 'clsx';

interface Props {
  currentUserId?: string;
  locale?: 'uk' | 'en';
}

export default function LeaderboardTable({ currentUserId, locale = 'uk' }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const snapshot = await get(child(ref(db), 'leaderboard'));
        if (snapshot.exists()) {
          const data = snapshot.val() as Record<string, LeaderboardEntry>;
          const sorted = Object.values(data)
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, 50);
          setEntries(sorted);
        }
      } catch (error) {
        console.error('Leaderboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-16">
        <div className="h-8 w-8 animate-spin border-4 border-brand-orange border-t-transparent" />
        <p className="text-xs font-medium uppercase tracking-widest text-brand-dark/30">
          {locale === 'uk' ? 'Завантаження...' : 'Loading...'}
        </p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white border border-sunshine-300/40 p-12 text-center shadow-golden-sm">
        <span className="mb-4 block text-5xl">🏆</span>
        <p className="text-sm font-medium text-brand-dark/40">
          {locale === 'uk' ? 'Поки немає результатів. Будьте першим!' : 'No results yet. Be the first!'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow-golden animate-fade-in">
      {/* ── Header ── */}
      <div className="relative bg-brand-dark px-5 py-5">
        <div className="h-[2px] absolute top-0 left-0 right-0 bg-fire-gradient" />
        <h2 className="gradient-text text-xl font-semibold">
          {locale === 'uk' ? 'Таблиця лідерів' : 'Leaderboard'}
        </h2>
        <p className="mt-0.5 text-xs text-white/35">
          {locale === 'uk' ? `Топ ${entries.length} гравців` : `Top ${entries.length} players`}
        </p>
      </div>

      {/* ── Top 3 podium ── */}
      {entries.length >= 3 && (
        <div className="grid grid-cols-3 gap-px border-b border-sunshine-300/30 bg-sunshine-300/20">
          {[entries[1], entries[0], entries[2]].map((entry, podiumIdx) => {
            const rank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
            const isCenter = podiumIdx === 1;
            return (
              <div
                key={entry.id}
                className={clsx(
                  'flex flex-col items-center px-2 py-4 text-center',
                  isCenter && 'bg-brand-yellow/10 py-6',
                )}
              >
                <span className={clsx('text-2xl', isCenter && 'text-3xl')}>{medal}</span>
                <p className={clsx(
                  'mt-2 truncate max-w-full text-xs font-semibold text-brand-dark',
                  isCenter && 'text-sm',
                )}>
                  {entry.userName}
                </p>
                <p className={clsx(
                  'mt-0.5 font-mono font-bold tabular-nums text-brand-orange',
                  isCenter ? 'text-lg' : 'text-sm',
                )}>
                  {entry.totalScore}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Full table ── */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-sunshine-300/30 bg-surface-ivory text-left">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-brand-dark/40">#</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-brand-dark/40">
                {locale === 'uk' ? 'Гравець' : 'Player'}
              </th>
              <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-widest text-brand-dark/40">
                {locale === 'uk' ? 'Бали' : 'Score'}
              </th>
              <th className="hidden px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-widest text-brand-dark/40 sm:table-cell">
                {locale === 'uk' ? 'Обл.' : 'Reg.'}
              </th>
              <th className="hidden px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-widest text-brand-dark/40 sm:table-cell">
                {locale === 'uk' ? 'Точн.' : 'Acc.'}
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => {
              const isYou = entry.userId === currentUserId;
              const isTop3 = i < 3;
              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;

              return (
                <tr
                  key={entry.id}
                  className={clsx(
                    'border-b border-sunshine-300/20 transition-colors',
                    isYou && 'bg-brand-yellow/8',
                    !isYou && isTop3 && 'bg-sunshine-300/10',
                    !isYou && !isTop3 && 'hover:bg-surface-ivory',
                  )}
                >
                  <td className="px-4 py-3 text-sm">
                    {medal ? (
                      <span className="text-base">{medal}</span>
                    ) : (
                      <span className="font-mono text-xs text-brand-dark/35 tabular-nums">
                        {i + 1}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx('text-sm', isTop3 ? 'font-semibold text-brand-dark' : 'text-brand-dark/80')}>
                      {entry.userName}
                    </span>
                    {isYou && (
                      <span className="ml-2 bg-brand-yellow px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-dark">
                        {locale === 'uk' ? 'Ви' : 'You'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={clsx(
                      'font-mono font-semibold tabular-nums',
                      isTop3 ? 'text-brand-orange' : 'text-sm text-brand-dark/70'
                    )}>
                      {entry.totalScore}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-right text-sm text-brand-dark/50 sm:table-cell tabular-nums">
                    {entry.regionsCompleted}
                  </td>
                  <td className="hidden px-4 py-3 text-right text-sm text-brand-dark/50 sm:table-cell tabular-nums">
                    {entry.accuracy}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export async function updateLeaderboard(
  userId: string,
  userName: string,
  totalScore: number,
  regionsCompleted: number,
  totalQuizzes: number,
  accuracy: number
) {
  try {
    const leaderboardRef = ref(db, `leaderboard/${userId}`);
    await set(leaderboardRef, {
      id: userId,
      userName,
      userId,
      totalScore,
      regionsCompleted,
      totalQuizzes,
      accuracy,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Leaderboard update error:', error);
  }
}
