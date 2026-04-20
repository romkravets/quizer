import type { UserProgress, RegionProgress, Badge } from "@/types";
import { BADGES } from "./badges";

const STORAGE_KEY = "uaquiz_progress";

export function getProgress(): UserProgress {
  if (typeof window === "undefined") {
    return createEmptyProgress();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyProgress();
    return JSON.parse(raw) as UserProgress;
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage full — silently ignore
  }
}

export function recordQuizResult(
  region: string,
  correctAnswers: number,
  totalQuestions: number,
  score: number,
): UserProgress {
  const progress = getProgress();
  const today = new Date().toISOString().slice(0, 10);

  // Update streak
  if (progress.lastPlayedDate === today) {
    // Same day — no change
  } else {
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);
    progress.streak =
      progress.lastPlayedDate === yesterday ? progress.streak + 1 : 1;
  }
  progress.lastPlayedDate = today;

  // Update region progress
  const existing: RegionProgress = progress.regions[region] || {
    region,
    quizzesCompleted: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    bestScore: 0,
    lastPlayedAt: 0,
  };

  existing.quizzesCompleted += 1;
  existing.totalCorrect += correctAnswers;
  existing.totalQuestions += totalQuestions;
  existing.bestScore = Math.max(existing.bestScore, score);
  existing.lastPlayedAt = Date.now();
  progress.regions[region] = existing;

  // Update totals
  progress.totalQuizzesCompleted += 1;
  progress.totalCorrect += correctAnswers;
  progress.totalQuestions += totalQuestions;

  // Check new badges
  progress.badges = checkBadges(progress);

  saveProgress(progress);
  return progress;
}

export function checkBadges(progress: UserProgress): string[] {
  const earned: string[] = [];
  for (const badge of BADGES) {
    if (badge.condition(progress)) {
      earned.push(badge.id);
    }
  }
  return earned;
}

export function getCompletedRegions(progress: UserProgress): string[] {
  return Object.keys(progress.regions).filter(
    (r) => progress.regions[r].quizzesCompleted > 0,
  );
}

export function getRegionAccuracy(
  progress: UserProgress,
  region: string,
): number {
  const rp = progress.regions[region];
  if (!rp || rp.totalQuestions === 0) return 0;
  return Math.round((rp.totalCorrect / rp.totalQuestions) * 100);
}

export function getOverallAccuracy(progress: UserProgress): number {
  if (progress.totalQuestions === 0) return 0;
  return Math.round((progress.totalCorrect / progress.totalQuestions) * 100);
}

function createEmptyProgress(): UserProgress {
  return {
    regions: {},
    totalQuizzesCompleted: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    badges: [],
    streak: 0,
    lastPlayedDate: "",
  };
}
