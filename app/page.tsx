'use client'

import { useState, useEffect, useCallback } from 'react'
import { GameCard } from '@/components/game-card'
import { AdminDialog } from '@/components/admin-dialog'
import { DateSelector } from '@/components/date-selector'
import { StatusLegend } from '@/components/status-legend'
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
  }, [loadRecords])

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
          <div className="flex items-center gap-3">
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

        {/* Date Selector */}
        <section className="mb-6">
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </section>

        {/* Status Legend */}
        <section className="mb-6">
          <StatusLegend />
        </section>

        {/* Progress Summary */}
        {!isFuture && (
          <section className="mb-6">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">今日进度:</span>
              <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
              <span className="text-foreground font-medium">
                {completedCount}/{totalCount}
              </span>
            </div>
          </section>
        )}

        {/* Future Date Warning */}
        {isFuture && (
          <section className="mb-6">
            <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 text-yellow-400">
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
