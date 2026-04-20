'use client';

import ProgressDashboard from '@/components/Progress/ProgressDashboard';
import NavBar from '@/components/ui/NavBar';

export default function ProgressPage() {
  return (
    <>
      <NavBar showProgress={false} />
      <main className="min-h-screen bg-gray-50 pb-8">
        <ProgressDashboard locale="uk" />
      </main>
    </>
  );
}
