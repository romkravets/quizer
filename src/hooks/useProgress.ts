'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserProgress } from '@/types';
import { getProgress, recordQuizResult, getCompletedRegions, getOverallAccuracy } from '@/lib/progress';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const recordResult = useCallback(
    (region: string, correct: number, total: number, score: number) => {
      const updated = recordQuizResult(region, correct, total, score);
      setProgress(updated);
      return updated;
    },
    []
  );

  const completedRegions = progress ? getCompletedRegions(progress) : [];
  const overallAccuracy = progress ? getOverallAccuracy(progress) : 0;

  return {
    progress,
    recordResult,
    completedRegions,
    overallAccuracy,
  };
}
