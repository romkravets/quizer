import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Квізи України — Перевір свої знання',
    short_name: 'UA Quiz',
    description: 'Інтерактивна карта з квізами про всі 26 областей України',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#e6b740',
    orientation: 'portrait',
    categories: ['education', 'games'],
    lang: 'uk',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
