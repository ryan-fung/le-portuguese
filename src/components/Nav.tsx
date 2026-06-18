import { BookOpen, Headphones, Mic2, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useStore, type RouteId } from '@/store'

interface NavItem {
  id: RouteId
  label: string
  icon: LucideIcon
}

const NAV: NavItem[] = [
  { id: 'reader', label: 'Reader', icon: BookOpen },
  { id: 'lab', label: 'Sound Lab', icon: Sparkles },
  { id: 'drills', label: 'Drills', icon: Headphones },
  { id: 'learn', label: 'Learn', icon: Mic2 },
]

export function Nav() {
  const route = useStore((s) => s.route)
  const setRoute = useStore((s) => s.setRoute)

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden shrink-0 flex-col gap-1 border-r p-3 sm:flex sm:w-52 theme-bg-nav">
        <div className="mb-4 flex items-center gap-2 px-2 pt-2">
          <span className="text-2xl font-bold theme-text-accent">Lê</span>
          <span className="text-xs leading-tight theme-text-muted">Read Portuguese aloud</span>
        </div>
        {NAV.map((item) => {
          const Icon = item.icon
          const active = route === item.id
          return (
            <button
              key={item.id}
              onClick={() => setRoute(item.id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                active ? 'theme-nav-item-active' : 'theme-nav-item-inactive'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t backdrop-blur sm:hidden theme-bg-nav-mobile">
        {NAV.map((item) => {
          const Icon = item.icon
          const active = route === item.id
          return (
            <button
              key={item.id}
              onClick={() => setRoute(item.id)}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition ${
                active ? 'theme-text-accent' : 'theme-text-muted'
              }`}
              aria-current={active ? 'page' : undefined}
              style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
            >
              <Icon size={20} />
              {item.label}
            </button>
          )
        })}
      </nav>
    </>
  )
}
