import { Moon, Sun } from 'lucide-react'
import { useStore } from '@/store'

export function ThemeToggle() {
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-lg p-2 theme-text-secondary transition hover:theme-bg-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
