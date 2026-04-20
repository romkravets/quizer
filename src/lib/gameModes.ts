import type { GameModeConfig } from '@/types';

export const GAME_MODES: GameModeConfig[] = [
  {
    id: 'learn',
    labelUk: 'Навчання',
    labelEn: 'Learn',
    icon: '📖',
    descriptionUk: 'Підказки та пояснення увімкнені. Без обмеження часу.',
    descriptionEn: 'Hints and explanations enabled. No time limit.',
    showHints: true,
    timed: false,
  },
  {
    id: 'exam',
    labelUk: 'Іспит',
    labelEn: 'Exam',
    icon: '📝',
    descriptionUk: 'Без підказок, 30 секунд на питання.',
    descriptionEn: 'No hints, 30 seconds per question.',
    showHints: false,
    timed: true,
    timePerQuestion: 30,
  },
  {
    id: 'marathon',
    labelUk: 'Марафон',
    labelEn: 'Marathon',
    icon: '🏃',
    descriptionUk: 'Всі питання підряд. Підказки увімкнені.',
    descriptionEn: 'All questions in sequence. Hints enabled.',
    showHints: true,
    timed: false,
  },
];

export function getGameMode(id: string): GameModeConfig {
  return GAME_MODES.find((m) => m.id === id) ?? GAME_MODES[0];
}
