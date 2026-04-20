import type { Locale } from '@/types';
import ukMessages from '@/messages/uk.json';
import enMessages from '@/messages/en.json';

const LOCALE_KEY = 'uaquiz_locale';

export function getLocale(): Locale {
  if (typeof window === 'undefined') return 'uk';
  try {
    const saved = localStorage.getItem(LOCALE_KEY);
    if (saved === 'en' || saved === 'uk') return saved;
  } catch {
    // ignore
  }
  return 'uk';
}

export function setLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    // ignore
  }
}

type Messages = Record<string, string | Record<string, string>>;

const allMessages: Record<Locale, Messages> = {
  uk: ukMessages as unknown as Messages,
  en: enMessages as unknown as Messages,
};

export async function loadMessages(locale: Locale): Promise<Messages> {
  return allMessages[locale];
}

export function t(
  messages: Messages,
  key: string,
  params?: Record<string, string | number>
): string {
  const parts = key.split('.');
  let value: unknown = messages;
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  if (typeof value !== 'string') return key;

  if (params) {
    return value.replace(/{(\w+)}/g, (_, k: string) =>
      params[k] !== undefined ? String(params[k]) : `{${k}}`
    );
  }
  return value;
}
