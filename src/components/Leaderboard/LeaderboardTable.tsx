'use client';

import { useState, useEffect } from 'react';
import { ref, get, child, set, push } from 'firebase/database';
import { db } from '@/components/db/firebase';
import type { LeaderboardEntry } from '@/types';

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
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin border-4 border-brand-orange border-t-transparent" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-surface-cream p-8 text-center shadow-golden-sm">
        <span className="mb-2 block text-4xl">🏆</span>
        <p className="text-brand-dark/50">
          {locale === 'uk' ? 'Поки немає результатів. Будьте першим!' : 'No results yet. Be the first!'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-surface-cream shadow-golden">
      <div className="bg-gradient-to-r from-brand-orange to-brand-yellow p-4">
        <h2 className="text-xl text-white">
          {locale === 'uk' ? '🏆 Таблиця лідерів' : '🏆 Leaderboard'}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-sunshine-300/30 bg-sunshine-300/20 text-left text-sm text-brand-dark/50">
              <th className="p-3">#</th>
              <th className="p-3">{locale === 'uk' ? 'Гравець' : 'Player'}</th>
              <th className="p-3 text-right">{locale === 'uk' ? 'Бали' : 'Score'}</th>
              <th className="hidden p-3 text-right sm:table-cell">
                {locale === 'uk' ? 'Області' : 'Regions'}
              </th>
              <th className="hidden p-3 text-right sm:table-cell">
                {locale === 'uk' ? 'Точність' : 'Accuracy'}
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => {
              const isYou = entry.userId === currentUserId;
              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
              return (
                <tr
                  key={entry.id}
                  className={`border-b border-sunshine-300/20 transition-colors ${
                    isYou ? 'bg-brand-yellow/10' : 'hover:bg-sunshine-300/10'
                  }`}
                >
                  <td className="p-3">
                    {medal || i + 1}
                  </td>
                  <td className="p-3">
                    {entry.userName}
                    {isYou && (
                      <span className="ml-2 bg-brand-yellow px-1.5 py-0.5 text-xs text-brand-dark">
                        {locale === 'uk' ? 'Ви' : 'You'}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right font-mono">{entry.totalScore}</td>
                  <td className="hidden p-3 text-right sm:table-cell">
                    {entry.regionsCompleted}
                  </td>
                  <td className="hidden p-3 text-right sm:table-cell">
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
