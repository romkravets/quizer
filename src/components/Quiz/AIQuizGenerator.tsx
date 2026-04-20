'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { AIGeneratedQuestion } from '@/types';

interface Props {
  region: string;
  locale?: 'uk' | 'en';
}

export default function AIQuizGenerator({ region, locale = 'uk' }: Props) {
  const [questions, setQuestions] = useState<AIGeneratedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region, count: 5, difficulty }),
        signal: abortRef.current.signal,
      });
      if (!res.ok) throw new Error('Failed to generate');
      const data = await res.json();
      if (!data.questions?.length) {
        setError(locale === 'uk' ? 'Не вдалося згенерувати питання' : 'Failed to generate questions');
        return;
      }
      setQuestions(data.questions);
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return;
      setError(locale === 'uk' ? 'AI сервіс тимчасово недоступний' : 'AI service temporarily unavailable');
    } finally {
      setLoading(false);
    }
  }, [region, difficulty, locale]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    const current = questions[currentIndex];
    if (answerIndex + 1 === current.correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-2 text-xl font-bold text-brand-dark">
          {locale === 'uk' ? '🎉 Результат AI-квізу' : '🎉 AI Quiz Result'}
        </h3>
        <p className="mb-4 text-lg">
          {score} / {questions.length}{' '}
          {locale === 'uk' ? 'правильних' : 'correct'}
        </p>
        <button
          onClick={generate}
          className="rounded-lg bg-brand-yellow px-6 py-2 font-medium text-brand-dark transition-colors hover:bg-brand-yellow/80"
        >
          {locale === 'uk' ? '🔄 Згенерувати нові' : '🔄 Generate new'}
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-brand-dark">
          {locale === 'uk' ? '🤖 AI-генерація питань' : '🤖 AI Question Generator'}
        </h3>

        <div className="mb-4 flex gap-2">
          {(['easy', 'medium', 'hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                difficulty === d
                  ? 'bg-brand-yellow text-brand-dark'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {d === 'easy'
                ? locale === 'uk' ? 'Легко' : 'Easy'
                : d === 'medium'
                  ? locale === 'uk' ? 'Середньо' : 'Medium'
                  : locale === 'uk' ? 'Складно' : 'Hard'}
            </button>
          ))}
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-brand-green px-6 py-3 font-medium text-white transition-colors hover:bg-brand-green/80 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {locale === 'uk' ? 'Генеруємо...' : 'Generating...'}
            </>
          ) : (
            <>
              <span>🤖</span>
              {locale === 'uk' ? 'Згенерувати питання' : 'Generate Questions'}
            </>
          )}
        </button>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <div className="mb-3 flex items-center justify-between text-sm text-gray-500">
        <span>
          {locale === 'uk' ? 'Питання' : 'Question'} {currentIndex + 1} / {questions.length}
        </span>
        <span>
          {locale === 'uk' ? 'Бали' : 'Score'}: {score}
        </span>
      </div>

      <h4 className="mb-4 text-lg font-semibold text-brand-dark">{current.question}</h4>

      <div className="mb-4 space-y-2">
        {current.answers.map((answer, i) => {
          const isSelected = selectedAnswer === i;
          const isCorrect = i + 1 === current.correctAnswer;
          const showFeedback = selectedAnswer !== null;

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selectedAnswer !== null}
              className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                showFeedback && isCorrect
                  ? 'border-green-500 bg-green-50'
                  : showFeedback && isSelected && !isCorrect
                    ? 'border-red-500 bg-red-50'
                    : isSelected
                      ? 'border-brand-yellow bg-brand-yellow/10'
                      : 'border-gray-200 hover:border-brand-yellow/50'
              }`}
            >
              <span className="mr-2 font-medium text-gray-400">
                {String.fromCharCode(65 + i)}.
              </span>
              {answer}
            </button>
          );
        })}
      </div>

      {selectedAnswer !== null && (
        <div className="mb-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
          <strong>{locale === 'uk' ? 'Пояснення:' : 'Explanation:'}</strong>{' '}
          {current.explanation}
        </div>
      )}

      {selectedAnswer !== null && (
        <button
          onClick={handleNext}
          className="rounded-lg bg-brand-yellow px-6 py-2 font-medium text-brand-dark transition-colors hover:bg-brand-yellow/80"
        >
          {currentIndex < questions.length - 1
            ? locale === 'uk' ? 'Далі →' : 'Next →'
            : locale === 'uk' ? 'Результат' : 'Result'}
        </button>
      )}
    </div>
  );
}
