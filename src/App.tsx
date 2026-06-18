import { lazy, Suspense, useEffect } from 'react'
import { Nav } from '@/components/Nav'
import { ThemeToggle } from '@/components/ThemeToggle'
import { VoiceQualityBanner } from '@/components/VoiceQualityBanner'
import { useStore } from '@/store'
import '@/components/VoiceQualityBanner.css'

const ReaderView = lazy(() => import('@/views/ReaderView').then((m) => ({ default: m.ReaderView })))
const LabView = lazy(() => import('@/views/LabView').then((m) => ({ default: m.LabView })))
const DrillsView = lazy(() => import('@/views/DrillsView').then((m) => ({ default: m.DrillsView })))
const LearnView = lazy(() => import('@/views/LearnView').then((m) => ({ default: m.LearnView })))

export function App() {
  const route = useStore((s) => s.route)
  const theme = useStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
    } else {
      root.classList.remove('light')
    }
  }, [theme])

  return (
    <div className="flex h-full">
      <VoiceQualityBanner />
      <Nav />
      <main className="flex flex-1 flex-col overflow-y-auto pb-20 sm:pb-0">
        <header className="sticky top-0 z-10 flex justify-end border-b theme-bg-nav px-4 py-2 sm:px-6">
          <ThemeToggle />
        </header>
        <div className="flex-1">
          <Suspense fallback={<div className="p-8 theme-text-muted">Loading…</div>}>
            {route === 'reader' && <ReaderView />}
            {route === 'lab' && <LabView />}
            {route === 'drills' && <DrillsView />}
            {route === 'learn' && <LearnView />}
          </Suspense>
        </div>
      </main>
    </div>
  )
}
