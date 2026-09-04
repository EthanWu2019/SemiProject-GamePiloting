'use client'

import { useState, useEffect, useCallback } from 'react'
import { GameCard } from '@/components/game-card'
import { AdminDialog } from '@/components/admin-dialog'
import { ContributionGrid } from '@/components/contribution-grid'
import { TimeDisplay } from '@/components/time-display'
import { ThemeToggle } from '@/components/theme-toggle'
import { ThemeInit } from '@/components/theme-init'
import { Confetti } from '@/components/confetti'
import { GameManager } from '@/components/game-manager'
import { TaskManager } from '@/components/task-manager'
import type { GameStatus, Game, OneTimeTask } from '@/lib/types'
import { getDailyRecord, updateGameStatus, getActiveGames, getAllGames, getOneTimeTasks, getPendingTasks } from '@/lib/storage'
import { getBeijingDateString, isFutureDate } from '@/lib/time'
import { RefreshCw, Settings, ListTodo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [games, setGames] = useState<Game[]>([])
  const [allGames, setAllGames] = useState<Game[]>([])
  const [tasks, setTasks] = useState<OneTimeTask[]>([])
  const [gameRecords, setGameRecords] = useState<
    Record<string, { status: GameStatus; lastUpdate: string }>
  >({})
  const [showConfetti, setShowConfetti] = useState(false)
  const [hasShownConfetti, setHasShownConfetti] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setSelectedDate(getBeijingDateString())
  }, [])

  // 加载游戏列表
  const loadGames = useCallback(async () => {
    const activeGames = await getActiveGames()
    const allGamesList = await getAllGames()
    setGames(activeGames)
    setAllGames(allGamesList)
  }, [])

  // 加载任务
  const loadTasks = useCallback(async () => {
    const taskList = isAdmin ? await getOneTimeTasks() : await getPendingTasks()
    setTasks(taskList)
  }, [isAdmin])

  // 加载选中日期的游戏记录
  const loadRecords = useCallback(async () => {
    if (!selectedDate || games.length === 0) return
    setIsLoading(true)
    
    try {
      const dailyRecord = await getDailyRecord(selectedDate)
      const records: Record<string, { status: GameStatus; lastUpdate: string }> = {}
      
      games.forEach((game) => {
        records[game.game_id] = dailyRecord[game.game_id] || { status: 'pending', lastUpdate: '' }
      })
      
      setGameRecords(records)
    } catch (error) {
      console.error('Error loading records:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedDate, games])

  useEffect(() => {
    loadGames()
  }, [loadGames])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  useEffect(() => {
    loadRecords()
    setHasShownConfetti(false)
  }, [loadRecords, selectedDate])

  // 检查是否全部完成并显示礼花
  useEffect(() => {
    const completedCount = Object.values(gameRecords).filter(
      (r) => r.status === 'completed'
    ).length
    const totalCount = games.length
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
  }, [gameRecords, selectedDate, hasShownConfetti, games.length])

  const handleStatusChange = async (gameId: string, status: GameStatus) => {
    const success = await updateGameStatus(selectedDate, gameId, status)
    if (success) {
      loadRecords()
    }
  }

  const handleLogin = () => setIsAdmin(true)
  const handleLogout = () => setIsAdmin(false)
  const handleConfettiComplete = () => setShowConfetti(false)
  const handleRefresh = () => {
    loadGames()
    loadRecords()
    loadTasks()
  }

  const isFuture = selectedDate ? isFutureDate(selectedDate) : false
  const completedCount = Object.values(gameRecords).filter((r) => r.status === 'completed').length
  const totalCount = games.length
  const pendingTasks = tasks.filter(t => t.status !== 'completed')

  if (!selectedDate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <ThemeInit />
      <Confetti show={showConfetti} onComplete={handleConfettiComplete} />
      
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-4 sm:py-8 max-w-2xl flex-1 flex flex-col">
          
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight">GamePiloting</h1>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-8 w-8"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <ThemeToggle />
              {isAdmin && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>管理设置</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="games" className="mt-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="games">常驻游戏</TabsTrigger>
                        <TabsTrigger value="tasks">单次任务</TabsTrigger>
                      </TabsList>
                      <TabsContent value="games" className="mt-4">
                        <GameManager games={allGames} onUpdate={handleRefresh} />
                      </TabsContent>
                      <TabsContent value="tasks" className="mt-4">
                        <TaskManager tasks={tasks} isAdmin={true} onUpdate={loadTasks} />
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              )}
              <AdminDialog
                isAdmin={isAdmin}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
            </div>
          </header>

          {/* Time Display */}
          <TimeDisplay />

          {/* Progress Summary */}
          {!isFuture && totalCount > 0 && (
            <div className="flex items-center justify-between py-3 px-4 mb-4 bg-secondary/50 rounded-lg">
              <span className="text-sm text-muted-foreground">今日进度</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium tabular-nums">{completedCount}/{totalCount}</span>
              </div>
            </div>
          )}

          {/* One-time Tasks (for client view) */}
          {!isAdmin && pendingTasks.length > 0 && (
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ListTodo className="h-4 w-4" />
                <span>临时任务</span>
              </div>
              <TaskManager tasks={pendingTasks} isAdmin={false} onUpdate={loadTasks} />
            </div>
          )}

          {/* Game Cards */}
          <section className="space-y-2 flex-1">
            {games.map((game) => {
              const record = gameRecords[game.game_id] || { status: 'pending' as GameStatus, lastUpdate: '' }
              return (
                <GameCard
                  key={game.game_id}
                  gameId={game.game_id}
                  gameName={game.name}
                  status={record.status}
                  isAdmin={isAdmin && !isFuture}
                  onStatusChange={handleStatusChange}
                />
              )
            })}
          </section>

          {/* Contribution Grid - Desktop only */}
          <div className="hidden sm:block mt-8">
            <ContributionGrid
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
