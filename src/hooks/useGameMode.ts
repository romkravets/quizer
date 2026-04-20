'use client';

import { useState, useCallback, useEffect } from 'react';
import type { GameMode } from '@/types';
import { getGameMode } from '@/lib/gameModes';

const STORAGE_KEY = 'uaquiz_gamemode';

export function useGameMode() {
  const [mode, setModeState] = useState<GameMode>('learn');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'learn' || saved === 'exam' || saved === 'marathon') {
        setModeState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setMode = useCallback((m: GameMode) => {
    setModeState(m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {
      // ignore
    }
  }, []);

  const config = getGameMode(mode);

  return { mode, setMode, config };
}
