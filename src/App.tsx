import { lazy, Suspense } from 'react'
import { Nav } from '@/components/Nav'
import { useStore } from '@/store'

const ReaderView = lazy(() => import('@/views/ReaderView').then((m) => ({ default: m.ReaderView })))
const LabView = lazy(() => import('@/views/LabView').then((m) => ({ default: m.LabView })))
const DrillsView = lazy(() => import('@/views/DrillsView').then((m) => ({ default: m.DrillsView })))
const LearnView = lazy(() => import('@/views/LearnView').then((m) => ({ default: m.LearnView })))

export function App() {
  const route = useStore((s) => s.route)

  return (
    <div className="flex h-full">
      <Nav />
      <main className="flex-1 overflow-y-auto pb-20 sm:pb-0">
        <Suspense fallback={<div className="p-8 text-slate-500">Loading…</div>}>
          {route === 'reader' && <ReaderView />}
          {route === 'lab' && <LabView />}
          {route === 'drills' && <DrillsView />}
          {route === 'learn' && <LearnView />}
        </Suspense>
      </main>
    </div>
  )
}
