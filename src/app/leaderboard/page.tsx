'use client';

import LeaderboardTable from '@/components/Leaderboard/LeaderboardTable';
import NavBar from '@/components/ui/NavBar';

export default function LeaderboardPage() {
  return (
    <>
      <NavBar showLeaderboard={false} />
      <main className="min-h-screen bg-surface-ivory p-4 pb-8">
        <div className="mx-auto max-w-3xl">
          <LeaderboardTable locale="uk" />
        </div>
      </main>
    </>
  );
}
