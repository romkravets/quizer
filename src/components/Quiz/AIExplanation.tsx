'use client';

import { useState } from 'react';
import type { AIExplanation as AIExplanationType } from '@/types';

interface Props {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  region: string;
  isCorrect: boolean;
  showHints: boolean;
}

export default function AIExplanation({
  question,
  correctAnswer,
  userAnswer,
  region,
  isCorrect,
  showHints,
}: Props) {
  const [data, setData] = useState<AIExplanationType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!showHints) return null;

  const fetchExplanation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, correctAnswer, userAnswer, region, isCorrect }),
      });
      if (!res.ok) throw new Error('AI unavailable');
      const json = await res.json();
      setData(json);
    } catch {
      setError('Не вдалося отримати пояснення');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-brand-yellow/30 bg-yellow-50 p-4">
      {!data && !loading && (
        <button
          onClick={fetchExplanation}
          className="flex items-center gap-2 rounded-lg bg-brand-yellow px-4 py-2 font-medium text-brand-dark transition-colors hover:bg-brand-yellow/80"
        >
          <span>🧠</span>
          <span>AI пояснення</span>
        </button>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-brand-dark/60">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-yellow border-t-transparent" />
          <span>AI аналізує відповідь...</span>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {data && (
        <div className="space-y-3">
          <div>
            <h4 className="mb-1 flex items-center gap-1.5 font-semibold text-brand-dark">
              <span>💡</span> Пояснення
            </h4>
            <p className="text-sm text-gray-700">{data.explanation}</p>
          </div>
          {data.funFact && (
            <div>
              <h4 className="mb-1 flex items-center gap-1.5 font-semibold text-brand-green">
                <span>🌟</span> Цікавий факт
              </h4>
              <p className="text-sm text-gray-700">{data.funFact}</p>
            </div>
          )}
          {data.historicalContext && (
            <div>
              <h4 className="mb-1 flex items-center gap-1.5 font-semibold text-brand-blue">
                <span>📜</span> Історичний контекст
              </h4>
              <p className="text-sm text-gray-700">{data.historicalContext}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
