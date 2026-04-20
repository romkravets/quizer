"use client"
import { useEffect, useState } from "react"
import MapUk from "../components/MapUk/MapUk"
import Link from "next/link"
import LanguageToggle from "@/components/ui/LanguageToggle"
import { useTranslation } from "@/hooks/useTranslation"
import { useProgress } from "@/hooks/useProgress"
import { regions } from "@/helpers/regionType"

const Home = () => {
  const { locale, toggleLocale, t } = useTranslation()
  const { progress, completedRegions } = useProgress()
  const [swRegistered, setSwRegistered] = useState(false)

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator && !swRegistered) {
      navigator.serviceWorker.register('/sw.js').then(() => {
        setSwRegistered(true)
      }).catch(() => {})
    }
  }, [swRegistered])

  // Highlight completed regions on the map via CSS
  useEffect(() => {
    if (!completedRegions.length) return
    completedRegions.forEach((region) => {
      const el = document.getElementById(region)
      if (el) {
        el.style.fill = '#99af5d'
        el.style.opacity = '0.85'
      }
    })
  }, [completedRegions])

  return (
    <div className="relative min-h-screen">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white/90 px-4 py-2 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-brand-dark">🇺🇦 {t('map.title')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/progress"
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-brand-dark hover:bg-gray-200 transition-colors"
          >
            📊 {t('common.progress')}
          </Link>
          <Link
            href="/leaderboard"
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-brand-dark hover:bg-gray-200 transition-colors"
          >
            🏆 {t('common.leaderboard')}
          </Link>
          <LanguageToggle locale={locale} onToggle={toggleLocale} />
        </div>
      </div>

      {/* Progress bar */}
      {progress && progress.totalQuizzesCompleted > 0 && (
        <div className="fixed top-[48px] left-0 right-0 z-40 bg-white/80 backdrop-blur-sm px-4 py-1.5 border-b border-gray-100">
          <div className="flex items-center gap-3 max-w-xl mx-auto">
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {t('map.completedRegions', {
                count: completedRegions.length,
                total: regions.length,
              })}
            </span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-yellow to-brand-green rounded-full transition-all duration-500"
                style={{ width: `${(completedRegions.length / regions.length) * 100}%` }}
              />
            </div>
            {progress.streak > 0 && (
              <span className="text-xs font-medium text-brand-red">🔥 {progress.streak}</span>
            )}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="pt-[48px]">
        <MapUk />
      </div>
    </div>
  )
}

export default Home
