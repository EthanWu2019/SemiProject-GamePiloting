'use client'

import { useState, useEffect, useCallback } from 'react'
import { GameCard } from '@/components/game-card'
import { AdminDialog } from '@/components/admin-dialog'
import { ContributionGrid } from '@/components/contribution-grid'
import { StatusLegend } from '@/components/status-legend'
import { TimeDisplay } from '@/components/time-display'
import { ThemeToggle } from '@/components/theme-toggle'
import { Confetti } from '@/components/confetti'
import { GAMES, type GameStatus } from '@/lib/types'
import { getGameRecord, updateGameStatus } from '@/lib/storage'
import { getBeijingDateString, isFutureDate } from '@/lib/time'
import { Badge } from '@/components/ui/badge'
import { Gamepad2, AlertCircle } from 'lucide-react'

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [gameRecords, setGameRecords] = useState<
    Record<string, { status: GameStatus; lastUpdate: string }>
  >({})
  const [showConfetti, setShowConfetti] = useState(false)
  const [hasShownConfetti, setHasShownConfetti] = useState(false)

  // 初始化选中日期
  useEffect(() => {
    setSelectedDate(getBeijingDateString())
  }, [])

  // 加载选中日期的游戏记录
  const loadRecords = useCallback(() => {
    if (!selectedDate) return
    const records: Record<string, { status: GameStatus; lastUpdate: string }> = {}
    GAMES.forEach((game) => {
      records[game.id] = getGameRecord(selectedDate, game.id)
    })
    setGameRecords(records)
  }, [selectedDate])

  useEffect(() => {
    loadRecords()
    // 重置礼花状态当日期变化
    setHasShownConfetti(false)
  }, [loadRecords, selectedDate])

  // 检查是否全部完成并显示礼花
  useEffect(() => {
    const completedCount = Object.values(gameRecords).filter(
      (r) => r.status === 'completed'
    ).length
    const totalCount = GAMES.length
    const today = getBeijingDateString()
    
    if (
      completedCount === totalCount && 
      totalCount > 0 && 
      selectedDate === today &&
      !hasShownConfetti
    ) {
      setShowConfetti(true)
      setHasShownConfetti(true)
    }
  }, [gameRecords, selectedDate, hasShownConfetti])

  const handleStatusChange = (gameId: string, status: GameStatus) => {
    updateGameStatus(selectedDate, gameId, status)
    loadRecords()
  }

  const handleLogin = () => {
    setIsAdmin(true)
  }

  const handleLogout = () => {
    setIsAdmin(false)
  }

  const handleConfettiComplete = () => {
    setShowConfetti(false)
  }

  const isFuture = selectedDate ? isFutureDate(selectedDate) : false

  // 计算完成进度
  const completedCount = Object.values(gameRecords).filter(
    (r) => r.status === 'completed'
  ).length
  const totalCount = GAMES.length

  if (!selectedDate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Confetti show={showConfetti} onComplete={handleConfettiComplete} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">GamePiloting</h1>
              <p className="text-sm text-muted-foreground">代肝进度追踪</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAdmin && (
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                管理模式
              </Badge>
            )}
            <AdminDialog
              isAdmin={isAdmin}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          </div>
        </header>

        {/* Time Display - C位展示 */}
        <TimeDisplay />

        {/* Contribution Grid */}
        <ContributionGrid
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* Current Date Display */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-secondary/50 rounded-lg px-4 py-2 text-sm">
            当前查看: <span className="font-medium text-foreground">{selectedDate}</span>
          </div>
        </div>

        {/* Status Legend */}
        <section className="mb-6">
          <StatusLegend />
        </section>

        {/* Progress Summary */}
        {!isFuture && (
          <section className="mb-6">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">当日进度:</span>
              <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500 ease-out"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
              <span className="text-foreground font-bold text-lg">
                {completedCount}/{totalCount}
              </span>
            </div>
          </section>
        )}

        {/* Future Date Warning */}
        {isFuture && (
          <section className="mb-6">
            <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">这是未来的日期，暂无记录数据</p>
            </div>
          </section>
        )}

        {/* Game Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GAMES.map((game) => {
            const record = gameRecords[game.id] || {
              status: 'pending' as GameStatus,
              lastUpdate: '',
            }
            return (
              <GameCard
                key={game.id}
                gameId={game.id}
                gameName={game.name}
                status={record.status}
                lastUpdate={record.lastUpdate}
                isAdmin={isAdmin && !isFuture}
                onStatusChange={handleStatusChange}
              />
            )
          })}
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>GamePiloting - 让代肝更透明</p>
        </footer>
      </div>
    </main>
  )
}
