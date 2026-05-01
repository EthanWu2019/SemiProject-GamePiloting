'use client'

import { useState, useEffect, useCallback } from 'react'
import { GameCard } from '@/components/game-card'
import { AdminDialog } from '@/components/admin-dialog'
import { ContributionGrid } from '@/components/contribution-grid'
import { TimeDisplay } from '@/components/time-display'
import { ThemeToggle } from '@/components/theme-toggle'
import { Confetti } from '@/components/confetti'
import { GAMES, type GameStatus } from '@/lib/types'
import { getGameRecord, updateGameStatus } from '@/lib/storage'
import { getBeijingDateString, isFutureDate } from '@/lib/time'
import { Badge } from '@/components/ui/badge'
import { Gamepad2, AlertCircle, Circle, PlayCircle, CheckCircle2 } from 'lucide-react'

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
  const inProgressCount = Object.values(gameRecords).filter(
    (r) => r.status === 'in_progress'
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
      
      {/* 手机端第一屏：100vh 包含所有关键信息 */}
      <div className="min-h-screen sm:min-h-0 flex flex-col">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 max-w-4xl flex-1 flex flex-col">
          {/* Header - 紧凑版 */}
          <header className="flex items-center justify-between gap-2 mb-3 sm:mb-6">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
              <div>
                <h1 className="text-base sm:text-xl font-bold text-foreground">GamePiloting</h1>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />
              {isAdmin && (
                <Badge variant="secondary" className="bg-primary/20 text-primary text-[10px] sm:text-xs px-1.5 sm:px-2">
                  管理中
                </Badge>
              )}
              <AdminDialog
                isAdmin={isAdmin}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
            </div>
          </header>

          {/* Time Display - C位 */}
          <TimeDisplay />

          {/* 移动端：进度摘要 */}
          {!isFuture && (
            <div className="flex items-center justify-center gap-4 mb-3 sm:mb-4 py-2 bg-secondary/30 rounded-lg sm:hidden">
              <div className="flex items-center gap-1.5 text-xs">
                <Circle className="h-3 w-3 text-red-400 fill-red-400" />
                <span>{totalCount - completedCount - inProgressCount}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <PlayCircle className="h-3 w-3 text-yellow-400" />
                <span>{inProgressCount}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="h-3 w-3 text-green-400" />
                <span>{completedCount}/{totalCount}</span>
              </div>
            </div>
          )}

          {/* Future Date Warning */}
          {isFuture && (
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2 text-yellow-600 dark:text-yellow-400 mb-3 sm:mb-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="text-xs sm:text-sm">这是未来的日期</p>
            </div>
          )}

          {/* Game Cards Grid - 紧凑 */}
          <section className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 flex-1 content-start">
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
        </div>
      </div>

      {/* 桌面端额外内容 */}
      <div className="hidden sm:block">
        <div className="container mx-auto px-4 pb-8 max-w-4xl">
          {/* Contribution Grid - 只在桌面端显示 */}
          <ContributionGrid
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />

          {/* Desktop Progress Bar */}
          {!isFuture && (
            <section className="mb-6">
              <div className="flex items-center gap-4 text-sm bg-card border border-border rounded-lg p-4">
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

          {/* Footer */}
          <footer className="pt-4 border-t border-border text-center text-sm text-muted-foreground">
            <p>GamePiloting - 让代肝更透明</p>
          </footer>
        </div>
      </div>
    </main>
  )
}
