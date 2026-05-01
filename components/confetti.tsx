'use client'

import { useEffect, useState, useCallback } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  size: number
  rotation: number
}

const COLORS = [
  '#22c55e', // green
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#06b6d4', // cyan
]

export function Confetti({ show, onComplete }: { show: boolean; onComplete?: () => void }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [isActive, setIsActive] = useState(false)

  const generatePieces = useCallback(() => {
    const newPieces: ConfettiPiece[] = []
    const count = 150

    for (let i = 0; i < count; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 3,
        size: 6 + Math.random() * 10,
        rotation: Math.random() * 360,
      })
    }

    return newPieces
  }, [])

  useEffect(() => {
    if (show && !isActive) {
      setIsActive(true)
      setPieces(generatePieces())

      const timer = setTimeout(() => {
        setIsActive(false)
        setPieces([])
        onComplete?.()
      }, 6000)

      return () => clearTimeout(timer)
    }
  }, [show, isActive, generatePieces, onComplete])

  if (!isActive || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece absolute"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            width: `${piece.size}px`,
            height: `${piece.size * 0.6}px`,
            backgroundColor: piece.color,
            borderRadius: '2px',
            animationDuration: `${piece.duration}s`,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
      
      {/* Celebration text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="text-4xl sm:text-6xl font-bold text-center animate-bounce"
          style={{
            textShadow: '0 4px 20px rgba(34, 197, 94, 0.5)',
            color: '#22c55e',
          }}
        >
          今日任务全部完成!
        </div>
      </div>
    </div>
  )
}
