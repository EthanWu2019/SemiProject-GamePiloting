'use client'

import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { getAllRecords } from '@/lib/storage'
import { getBeijingDateString, formatDateString } from '@/lib/time'
import { GAMES } from '@/lib/types'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { RotateCcw } from 'lucide-react'

interface ContributionGridProps {
  selectedDate: string
  onDateChange: (date: string) => void
}

function getCompletionLevel(date: string, records: Record<string, Record<string, { status: string }>>): number {
  const dayRecord = records[date]
  if (!dayRecord) return 0
  
  const completedCount = Object.values(dayRecord).filter(r => r.status === 'completed').length
  const totalGames = GAMES.length
  
  if (completedCount === 0) return 0
  if (completedCount === totalGames) return 4
  if (completedCount >= totalGames * 0.75) return 3
  if (completedCount >= totalGames * 0.5) return 2
  return 1
}

function getLast30Days(): string[] {
  const days: string[] = []
  const today = getBeijingDateString()
  const [year, month, day] = today.split('-').map(Number)
  const todayDate = new Date(year, month - 1, day)
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(todayDate)
    date.setDate(todayDate.getDate() - i)
    days.push(formatDateString(date))
  }
  
  return days
}

function getWeekdayLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return weekdays[date.getDay()]
}

function getDayLabel(dateStr: string): string {
  const day = dateStr.split('-')[2]
  return String(parseInt(day))
}

export function ContributionGrid({ selectedDate, onDateChange }: ContributionGridProps) {
  const today = getBeijingDateString()
  const days = useMemo(() => getLast30Days(), [])
  
  const records = useMemo(() => {
    if (typeof window === 'undefined') return {}
    return getAllRecords()
  }, [selectedDate]) // Re-fetch when selected date changes (after status updates)
  
  const levelColors = [
    'bg-muted',                           // Level 0: 无数据
    'bg-green-200 dark:bg-green-900',     // Level 1: 1-2 个
    'bg-green-400 dark:bg-green-700',     // Level 2: 3 个
    'bg-green-500 dark:bg-green-500',     // Level 3: 4 个
    'bg-green-600 dark:bg-green-400',     // Level 4: 全部完成
  ]

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">近30天代肝记录</h3>
        {selectedDate !== today && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDateChange(today)}
            className="text-xs gap-1.5"
          >
            <RotateCcw className="h-3 w-3" />
            回到今天
          </Button>
        )}
      </div>
      
      <TooltipProvider delayDuration={100}>
        <div className="flex gap-1 flex-wrap justify-center sm:justify-start">
          {days.map((date) => {
            const level = getCompletionLevel(date, records)
            const isSelected = date === selectedDate
            const isToday = date === today
            const completedCount = records[date] 
              ? Object.values(records[date]).filter(r => r.status === 'completed').length 
              : 0
            
            return (
              <Tooltip key={date}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onDateChange(date)}
                    className={`
                      w-6 h-6 sm:w-7 sm:h-7 rounded-sm transition-all duration-150
                      ${levelColors[level]}
                      ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                      ${isToday ? 'ring-1 ring-foreground/30' : ''}
                      hover:scale-110 hover:brightness-110
                    `}
                    aria-label={`${date}: ${completedCount}/${GAMES.length} 完成`}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <div className="font-medium">{date} (周{getWeekdayLabel(date)})</div>
                  <div className="text-muted-foreground">
                    完成: {completedCount}/{GAMES.length}
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </TooltipProvider>
      
      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
        <span>少</span>
        {levelColors.map((color, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
        ))}
        <span>多</span>
      </div>
    </div>
  )
}
