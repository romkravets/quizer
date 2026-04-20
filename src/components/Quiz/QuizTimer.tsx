'use client';

import { useState, useEffect, useRef } from 'react';

interface Props {
  seconds: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export default function QuizTimer({ seconds, onTimeUp, isActive }: Props) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, onTimeUp]);

  const percentage = (timeLeft / seconds) * 100;
  const isLow = timeLeft <= 5;

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-2 w-24 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isLow ? 'bg-brand-red' : 'bg-brand-green'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span
        className={`min-w-[3ch] text-right text-sm font-mono font-bold ${
          isLow ? 'text-brand-red animate-pulse' : 'text-brand-dark'
        }`}
      >
        {timeLeft}s
      </span>
    </div>
  );
}
