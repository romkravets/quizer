import type { MetadataRoute } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://uaquiz.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const regions = [
    'Crimea', 'Cherkasy', 'Chernihiv', 'Chernivtsi', 'Dnipropetrovsk',
    'Donetsk', 'Ivano-Frankivsk', 'Kharkiv', 'Kherson', 'Khmelnytskyi',
    'Kyiv', 'KyivCity', 'Kirovohrad', 'Luhansk', 'Lviv', 'Mykolaiv',
    'Odessa', 'Poltava', 'Rivne', 'Sumu', 'Ternopil', 'Zakarpattia',
    'Vinnytsia', 'Volyn', 'Zaporizhia', 'Zhytomyr',
  ];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${APP_URL}/progress`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${APP_URL}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const regionPages: MetadataRoute.Sitemap = regions.map((region) => ({
    url: `${APP_URL}/dashboard?data=${region}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...regionPages];
}
