'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Locale } from '@/types';
import { getLocale, setLocale as saveLocale, loadMessages, t as translate } from '@/lib/i18n';

type Messages = Record<string, string | Record<string, string>>;

export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>('uk');
  const [messages, setMessages] = useState<Messages | null>(null);

  useEffect(() => {
    const saved = getLocale();
    setLocaleState(saved);
    loadMessages(saved).then(setMessages);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    saveLocale(l);
    loadMessages(l).then(setMessages);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      if (!messages) return key;
      return translate(messages, key, params);
    },
    [messages]
  );

  const toggleLocale = useCallback(() => {
    const next = locale === 'uk' ? 'en' : 'uk';
    setLocale(next);
  }, [locale, setLocale]);

  return { locale, setLocale, toggleLocale, t, ready: messages !== null };
}
