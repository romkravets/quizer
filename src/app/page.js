"use client";
import { useEffect, useState } from "react";
import MapUk from "../components/MapUk/MapUk";
import Link from "next/link";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useTranslation } from "@/hooks/useTranslation";
import { useProgress } from "@/hooks/useProgress";
import { regions } from "@/helpers/regionType";

const Home = () => {
  const { locale, toggleLocale, t } = useTranslation();
  const { progress, completedRegions } = useProgress();
  const [swRegistered, setSwRegistered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Register service worker for PWA
  useEffect(() => {
    if ("serviceWorker" in navigator && !swRegistered) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          setSwRegistered(true);
        })
        .catch(() => {});
    }
  }, [swRegistered]);

  // Highlight completed regions on the map
  useEffect(() => {
    if (!completedRegions.length) return;
    completedRegions.forEach((region) => {
      const el = document.getElementById(region);
      if (el) {
        el.style.fill = "#fb6424";
        el.style.opacity = "0.85";
      }
    });
  }, [completedRegions]);

  const pct =
    regions.length > 0
      ? Math.round((completedRegions.length / regions.length) * 100)
      : 0;

  return (
    <div className="relative min-h-screen bg-surface-ivory">
      {/* ── Dark top bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-brand-dark shadow-dark-lg">
        {/* Fire gradient accent line */}
        <div className="h-[2px] w-full bg-fire-gradient" />

        <div className="flex items-center justify-between px-4 py-2.5">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none">🇺🇦</span>
            <span className="gradient-text text-sm font-semibold tracking-tight">
              {t("map.title")}
            </span>
          </div>

          {/* Nav + lang */}
          <div className="flex items-center gap-1">
            <Link
              href="/progress"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium uppercase tracking-wider text-white/50 transition-colors hover:text-brand-yellow"
            >
              <span>📊</span>
              <span className="hidden sm:inline">{t("common.progress")}</span>
            </Link>
            <Link
              href="/leaderboard"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium uppercase tracking-wider text-white/50 transition-colors hover:text-brand-yellow"
            >
              <span>🏆</span>
              <span className="hidden sm:inline">
                {t("common.leaderboard")}
              </span>
            </Link>
            <LanguageToggle locale={locale} onToggle={toggleLocale} />
          </div>
        </div>

        {/* ── Progress strip (only when started) ── */}
        {mounted && progress && progress.totalQuizzesCompleted > 0 && (
          <div className="flex items-center gap-3 border-t border-white/10 px-4 py-1.5">
            <span className="shrink-0 text-xs text-white/35 tabular-nums">
              {completedRegions.length}/{regions.length}
            </span>
            <div className="relative h-1 flex-1 overflow-hidden bg-white/10">
              <div
                className="absolute inset-y-0 left-0 bg-fire-gradient transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="shrink-0 text-xs font-medium text-brand-yellow tabular-nums">
              {pct}%
            </span>
            {progress.streak > 0 && (
              <span className="shrink-0 text-xs text-brand-orange">
                🔥 {progress.streak}
              </span>
            )}
          </div>
        )}
      </header>

      {/* ── Map ── */}
      <div
        style={{
          height: "100vh",
          paddingTop:
            mounted && progress && progress.totalQuizzesCompleted > 0
              ? "80px"
              : "48px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <MapUk />
      </div>
    </div>
  );
};

export default Home;
