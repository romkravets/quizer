'use client';

import type { GameMode } from '@/types';
import { GAME_MODES } from '@/lib/gameModes';
import clsx from 'clsx';

interface Props {
  selected: GameMode;
  onSelect: (mode: GameMode) => void;
  locale?: 'uk' | 'en';
}

export default function GameModeSelector({ selected, onSelect, locale = 'uk' }: Props) {
  return (
    <div className="mx-auto mb-6 max-w-lg">
      <h3 className="mb-3 text-center text-lg font-semibold text-brand-dark">
        {locale === 'uk' ? 'Оберіть режим гри' : 'Choose Game Mode'}
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {GAME_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className={clsx(
              'flex flex-col items-center rounded-xl border-2 p-3 transition-all',
              selected === mode.id
                ? 'border-brand-yellow bg-brand-yellow/10 shadow-md'
                : 'border-gray-200 bg-white hover:border-brand-yellow/50'
            )}
          >
            <span className="mb-1 text-2xl">{mode.icon}</span>
            <span className="text-sm font-medium text-brand-dark">
              {locale === 'uk' ? mode.labelUk : mode.labelEn}
            </span>
            <span className="mt-1 text-xs text-gray-500">
              {locale === 'uk' ? mode.descriptionUk : mode.descriptionEn}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
