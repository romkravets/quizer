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

  // Highlight completed regions on the map
  useEffect(() => {
    if (!completedRegions.length) return
    completedRegions.forEach((region) => {
      const el = document.getElementById(region)
      if (el) {
        el.style.fill = '#fb6424'
        el.style.opacity = '0.85'
      }
    })
  }, [completedRegions])

  return (
    <div className="relative min-h-screen bg-surface-ivory">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-surface-cream/90 px-4 py-2 backdrop-blur-sm border-b border-sunshine-300/40">
        <div className="flex items-center gap-3">
          <span className="text-lg text-brand-dark">🇺🇦 {t('map.title')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/progress"
            className="bg-surface-cream px-3 py-1.5 text-sm text-brand-dark hover:bg-sunshine-300 transition-colors"
          >
            📊 {t('common.progress')}
          </Link>
          <Link
            href="/leaderboard"
            className="bg-surface-cream px-3 py-1.5 text-sm text-brand-dark hover:bg-sunshine-300 transition-colors"
          >
            🏆 {t('common.leaderboard')}
          </Link>
          <LanguageToggle locale={locale} onToggle={toggleLocale} />
        </div>
      </div>

      {/* Progress bar */}
      {progress && progress.totalQuizzesCompleted > 0 && (
        <div className="fixed top-[48px] left-0 right-0 z-40 bg-surface-cream/80 backdrop-blur-sm px-4 py-1.5 border-b border-sunshine-300/30">
          <div className="flex items-center gap-3 max-w-xl mx-auto">
            <span className="text-xs text-brand-dark/50 whitespace-nowrap">
              {t('map.completedRegions', {
                count: completedRegions.length,
                total: regions.length,
              })}
            </span>
            <div className="flex-1 h-2 bg-sunshine-300/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-orange to-brand-yellow transition-all duration-500"
                style={{ width: `${(completedRegions.length / regions.length) * 100}%` }}
              />
            </div>
            {progress.streak > 0 && (
              <span className="text-xs text-brand-orange">🔥 {progress.streak}</span>
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
