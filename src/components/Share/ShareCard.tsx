'use client';

import { useState, useCallback } from 'react';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
  ViberShareButton,
  ViberIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'next-share';

interface Props {
  region: string;
  score: number;
  correct: number;
  total: number;
  userName?: string;
  locale?: 'uk' | 'en';
}

export default function ShareCard({
  region,
  score,
  correct,
  total,
  userName = '',
  locale = 'uk',
}: Props) {
  const [copied, setCopied] = useState(false);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://uaquiz.vercel.app';
  const ogUrl = `${appUrl}/api/og?region=${encodeURIComponent(region)}&score=${score}&correct=${correct}&total=${total}&name=${encodeURIComponent(userName)}`;
  const shareUrl = appUrl;

  const shareText =
    locale === 'uk'
      ? `🇺🇦 Я знаю ${region} на ${score}%! (${correct}/${total}) А ти? Перевір себе:`
      : `🇺🇦 I scored ${score}% on ${region}! (${correct}/${total}) Can you beat that?`;

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Квізи України', text: shareText, url: shareUrl });
      } catch {
        // User cancelled
      }
    }
  }, [shareText, shareUrl]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareText, shareUrl]);

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      {/* Preview card */}
      <div className="mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-brand-yellow/20 to-brand-green/20 p-4">
        <div className="mb-2 text-center text-3xl">🇺🇦</div>
        <h3 className="text-center text-lg font-bold text-brand-dark">
          {locale === 'uk' ? 'Квізи України' : 'Ukraine Quizzes'}
        </h3>
        <p className="mb-3 text-center text-sm text-gray-600">{region}</p>
        <div className="flex justify-center gap-4">
          <div className="rounded-lg bg-brand-yellow/30 px-4 py-2 text-center">
            <p className="text-2xl font-bold text-brand-dark">{score}%</p>
            <p className="text-xs text-gray-600">
              {locale === 'uk' ? 'Результат' : 'Score'}
            </p>
          </div>
          <div className="rounded-lg bg-brand-green/30 px-4 py-2 text-center">
            <p className="text-2xl font-bold text-white">
              {correct}/{total}
            </p>
            <p className="text-xs text-gray-600">
              {locale === 'uk' ? 'Правильних' : 'Correct'}
            </p>
          </div>
        </div>
      </div>

      {/* Share buttons */}
      <p className="mb-3 text-center text-sm font-medium text-brand-dark">
        {locale === 'uk' ? 'Поділитися з друзями!' : 'Share with friends!'}
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <TelegramShareButton url={shareUrl} title={shareText}>
          <TelegramIcon size={40} round />
        </TelegramShareButton>
        <FacebookShareButton url={shareUrl} quote={shareText} hashtag="#КвізиУкраїни">
          <FacebookIcon size={40} round />
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} title={shareText}>
          <TwitterIcon size={40} round />
        </TwitterShareButton>
        <ViberShareButton url={shareUrl} title={shareText}>
          <ViberIcon size={40} round />
        </ViberShareButton>
        <WhatsappShareButton url={shareUrl} title={shareText}>
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-blue/80"
          >
            📤 {locale === 'uk' ? 'Поділитися' : 'Share'}
          </button>
        )}
        <button
          onClick={handleCopyLink}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          {copied
            ? locale === 'uk' ? '✓ Скопійовано!' : '✓ Copied!'
            : locale === 'uk' ? '📋 Копіювати' : '📋 Copy'}
        </button>
      </div>
    </div>
  );
}
