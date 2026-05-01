'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'

interface Document {
  startViewTransition?: (callback: () => void) => ViewTransition
}

interface ViewTransition {
  ready: Promise<void>
  finished: Promise<void>
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [mounted, setMounted] = useState(false)
  const isAnimatingRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    
    setTheme(initialTheme)
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(initialTheme)
  }, [])

  const toggleTheme = useCallback(
    (e: React.MouseEvent) => {
      if (isAnimatingRef.current) return

      const x = e.clientX
      const y = e.clientY
      const w = window.innerWidth
      const h = window.innerHeight

      const maxRadius = Math.ceil(
        Math.sqrt(Math.max(x, w - x) ** 2 + Math.max(y, h - y) ** 2)
      )

      const newTheme = theme === 'dark' ? 'light' : 'dark'

      if ((document as unknown as Document).startViewTransition) {
        isAnimatingRef.current = true

        const transition = (document as unknown as Document).startViewTransition!(() => {
          document.documentElement.classList.remove('dark', 'light')
          document.documentElement.classList.add(newTheme)
          setTheme(newTheme)
          localStorage.setItem('theme', newTheme)
        })

        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 500,
              easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              pseudoElement: '::view-transition-new(root)',
            }
          )
        })

        transition.finished.then(() => {
          isAnimatingRef.current = false
        })
      } else {
        document.documentElement.classList.remove('dark', 'light')
        document.documentElement.classList.add(newTheme)
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
      }
    },
    [theme]
  )

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
    </Button>
  )
}
