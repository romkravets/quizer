import type { Badge, UserProgress } from "@/types";
import { regions } from "@/helpers/regionType";

function regionCount(p: UserProgress): number {
  return Object.keys(p.regions).filter((r) => p.regions[r].quizzesCompleted > 0)
    .length;
}

function accuracy(p: UserProgress): number {
  return p.totalQuestions > 0
    ? Math.round((p.totalCorrect / p.totalQuestions) * 100)
    : 0;
}

function regionAccuracy(p: UserProgress, region: string): number {
  const rp = p.regions[region];
  if (!rp || rp.totalQuestions === 0) return 0;
  return Math.round((rp.totalCorrect / rp.totalQuestions) * 100);
}

export const BADGES: Badge[] = [
  // ── Exploration badges ──────────────────────────────────────
  {
    id: "first_quiz",
    nameUk: "Перший крок",
    nameEn: "First Step",
    descriptionUk: "Пройдіть свій перший квіз",
    descriptionEn: "Complete your first quiz",
    icon: "🎯",
    tier: "bronze",
    condition: (p) => p.totalQuizzesCompleted >= 1,
  },
  {
    id: "explorer_5",
    nameUk: "Дослідник",
    nameEn: "Explorer",
    descriptionUk: "Пройдіть квізи в 5 різних областях",
    descriptionEn: "Complete quizzes in 5 different regions",
    icon: "🧭",
    tier: "bronze",
    condition: (p) => regionCount(p) >= 5,
  },
  {
    id: "explorer_13",
    nameUk: "Мандрівник",
    nameEn: "Traveler",
    descriptionUk: "Пройдіть квізи в 13 областях",
    descriptionEn: "Complete quizzes in 13 regions",
    icon: "🗺️",
    tier: "silver",
    condition: (p) => regionCount(p) >= 13,
  },
  {
    id: "all_regions",
    nameUk: "Патріот",
    nameEn: "Patriot",
    descriptionUk: "Пройдіть квізи в усіх 26 областях",
    descriptionEn: "Complete quizzes in all 26 regions",
    icon: "🇺🇦",
    tier: "platinum",
    condition: (p) => regionCount(p) >= regions.length,
  },

  // ── Accuracy badges ─────────────────────────────────────────
  {
    id: "accuracy_80",
    nameUk: "Розумник",
    nameEn: "Smart Cookie",
    descriptionUk: "Загальна точність 80%+",
    descriptionEn: "Overall accuracy 80%+",
    icon: "🧠",
    tier: "silver",
    condition: (p) => p.totalQuizzesCompleted >= 3 && accuracy(p) >= 80,
  },
  {
    id: "accuracy_95",
    nameUk: "Геній",
    nameEn: "Genius",
    descriptionUk: "Загальна точність 95%+",
    descriptionEn: "Overall accuracy 95%+",
    icon: "🏆",
    tier: "gold",
    condition: (p) => p.totalQuizzesCompleted >= 5 && accuracy(p) >= 95,
  },
  {
    id: "perfect_quiz",
    nameUk: "Ідеальний результат",
    nameEn: "Perfect Score",
    descriptionUk: "Набрати 100% в будь-якому квізі",
    descriptionEn: "Score 100% on any quiz",
    icon: "💯",
    tier: "gold",
    condition: (p) => Object.values(p.regions).some((r) => r.bestScore === 100),
  },

  // ── Streak badges ──────────────────────────────────────────
  {
    id: "streak_3",
    nameUk: "На хвилі",
    nameEn: "On a Roll",
    descriptionUk: "Грати 3 дні поспіль",
    descriptionEn: "Play 3 days in a row",
    icon: "🔥",
    tier: "bronze",
    condition: (p) => p.streak >= 3,
  },
  {
    id: "streak_7",
    nameUk: "Тиждень знань",
    nameEn: "Week of Knowledge",
    descriptionUk: "Грати 7 днів поспіль",
    descriptionEn: "Play 7 days in a row",
    icon: "⚡",
    tier: "silver",
    condition: (p) => p.streak >= 7,
  },
  {
    id: "streak_30",
    nameUk: "Місяць відданості",
    nameEn: "Month of Dedication",
    descriptionUk: "Грати 30 днів поспіль",
    descriptionEn: "Play 30 days in a row",
    icon: "👑",
    tier: "platinum",
    condition: (p) => p.streak >= 30,
  },

  // ── Volume badges ──────────────────────────────────────────
  {
    id: "quizzes_10",
    nameUk: "Завзятий гравець",
    nameEn: "Dedicated Player",
    descriptionUk: "Пройдіть 10 квізів",
    descriptionEn: "Complete 10 quizzes",
    icon: "📚",
    tier: "bronze",
    condition: (p) => p.totalQuizzesCompleted >= 10,
  },
  {
    id: "quizzes_50",
    nameUk: "Знавець",
    nameEn: "Expert",
    descriptionUk: "Пройдіть 50 квізів",
    descriptionEn: "Complete 50 quizzes",
    icon: "🎓",
    tier: "silver",
    condition: (p) => p.totalQuizzesCompleted >= 50,
  },
  {
    id: "quizzes_100",
    nameUk: "Майстер",
    nameEn: "Master",
    descriptionUk: "Пройдіть 100 квізів",
    descriptionEn: "Complete 100 quizzes",
    icon: "🌟",
    tier: "gold",
    condition: (p) => p.totalQuizzesCompleted >= 100,
  },

  // ── Region-specific badges ─────────────────────────────────
  ...generateRegionBadges(),
];

function generateRegionBadges(): Badge[] {
  const regionMap: Record<string, { uk: string; en: string }> = {
    Lviv: { uk: "Знавець Львова", en: "Lviv Expert" },
    Kyiv: { uk: "Знавець Києва", en: "Kyiv Expert" },
    KyivCity: { uk: "Столиця моя", en: "My Capital" },
    Odessa: { uk: "Знавець Одеси", en: "Odessa Expert" },
    Kharkiv: { uk: "Знавець Харкова", en: "Kharkiv Expert" },
    Kherson: { uk: "Захисник Херсона", en: "Defender of Kherson" },
    Donetsk: { uk: "Сила Донбасу", en: "Donbas Strength" },
    Crimea: { uk: "Крим — це Україна", en: "Crimea is Ukraine" },
    Luhansk: { uk: "Луганськ наш", en: "Luhansk is Ours" },
    Zaporizhia: { uk: "Козацька міць", en: "Cossack Power" },
    Dnipropetrovsk: { uk: "Знавець Дніпра", en: "Dnipro Expert" },
    Ternopil: { uk: "Знавець Тернополя", en: "Ternopil Expert" },
    Chernivtsi: { uk: "Знавець Буковини", en: "Bukovyna Expert" },
    "Ivano-Frankivsk": { uk: "Знавець Прикарпаття", en: "Prykarpattia Expert" },
    Zakarpattia: { uk: "Знавець Закарпаття", en: "Zakarpattia Expert" },
    Vinnytsia: { uk: "Знавець Вінниці", en: "Vinnytsia Expert" },
    Poltava: { uk: "Знавець Полтави", en: "Poltava Expert" },
    Chernihiv: { uk: "Знавець Чернігова", en: "Chernihiv Expert" },
    Cherkasy: { uk: "Знавець Черкас", en: "Cherkasy Expert" },
    Khmelnytskyi: { uk: "Знавець Хмельниччини", en: "Khmelnytskyi Expert" },
    Rivne: { uk: "Знавець Рівного", en: "Rivne Expert" },
    Volyn: { uk: "Знавець Волині", en: "Volyn Expert" },
    Sumu: { uk: "Знавець Сум", en: "Sumy Expert" },
    Kirovohrad: { uk: "Знавець Кіровоградщини", en: "Kirovohrad Expert" },
    Mykolaiv: { uk: "Знавець Миколаєва", en: "Mykolaiv Expert" },
    Zhytomyr: { uk: "Знавець Житомира", en: "Zhytomyr Expert" },
  };

  return Object.entries(regionMap).map(([region, names]) => ({
    id: `region_${region.toLowerCase()}`,
    nameUk: names.uk,
    nameEn: names.en,
    descriptionUk: `Набрати 90%+ точності в ${region}`,
    descriptionEn: `Score 90%+ accuracy in ${region}`,
    icon: "🏅",
    tier: "gold" as const,
    condition: (p: UserProgress) =>
      p.regions[region] !== undefined &&
      p.regions[region].quizzesCompleted >= 1 &&
      regionAccuracy(p, region) >= 90,
  }));
}

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}
