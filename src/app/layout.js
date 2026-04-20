import './globals.css';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://uaquiz.vercel.app';

export const metadata = {
  title: {
    default: 'Квізи України — Перевір свої знання про Україну 🇺🇦',
    template: '%s | Квізи України',
  },
  description:
    'Інтерактивна карта з квізами про всі 26 областей України. AI-пояснення, досягнення, таблиця лідерів. Вивчай, грай та змагайся з друзями.',
  keywords: [
    'Україна',
    'квіз',
    'тест',
    'географія',
    'освіта',
    'карта',
    'області',
    'Ukraine quiz',
    'education',
  ],
  authors: [{ name: 'UA Quiz' }],
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: '/',
    languages: { uk: '/', en: '/?lang=en' },
  },
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    alternateLocale: 'en_US',
    url: APP_URL,
    siteName: 'Квізи України',
    title: 'Квізи України — Перевір свої знання 🇺🇦',
    description:
      'Інтерактивна карта з квізами про всі 26 областей України. AI-пояснення, досягнення та змагання.',
    images: [
      {
        url: `${APP_URL}/api/og?region=Україна`,
        width: 1200,
        height: 630,
        alt: 'Квізи України',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Квізи України 🇺🇦',
    description: 'Перевір свої знання про всі 26 областей України!',
    images: [`${APP_URL}/api/og?region=Україна`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Квізи України',
  url: APP_URL,
  description: 'Інтерактивна карта з квізами про всі 26 областей України',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'UAH' },
  inLanguage: ['uk', 'en'],
  author: { '@type': 'Organization', name: 'UA Quiz' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#e6b740" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
