'use client'

import { useMemo, useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { getRecordsInRange, getActiveGames } from '@/lib/storage'
import { getBeijingDateString, formatDateString } from '@/lib/time'
import type { AllRecords } from '@/lib/types'
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

export function ContributionGrid({ selectedDate, onDateChange }: ContributionGridProps) {
  const today = getBeijingDateString()
  const days = useMemo(() => getLast30Days(), [])
  const [records, setRecords] = useState<AllRecords>({})
  const [totalGames, setTotalGames] = useState(5)

  const getCompletionLevel = useCallback((date: string): number => {
    const dayRecord = records[date]
    if (!dayRecord) return 0
    
    const completedCount = Object.values(dayRecord).filter(r => r.status === 'completed').length
    
    if (completedCount === 0) return 0
    if (completedCount === totalGames) return 4
    if (completedCount >= totalGames * 0.75) return 3
    if (completedCount >= totalGames * 0.5) return 2
    return 1
  }, [records, totalGames])
  
  useEffect(() => {
    const loadData = async () => {
      const games = await getActiveGames()
      setTotalGames(games.length || 5)
      
      if (days.length === 0) return
      const startDate = days[0]
      const endDate = days[days.length - 1]
      const data = await getRecordsInRange(startDate, endDate)
      setRecords(data)
    }
    loadData()
  }, [days, selectedDate])
  
  const levelColors = [
    'bg-secondary',
    'bg-emerald-200 dark:bg-emerald-900/50',
    'bg-emerald-300 dark:bg-emerald-800/70',
    'bg-emerald-400 dark:bg-emerald-600/80',
    'bg-emerald-500 dark:bg-emerald-500',
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">近30天记录</span>
        {selectedDate !== today && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDateChange(today)}
            className="h-6 text-xs gap-1 px-2"
          >
            <RotateCcw className="h-3 w-3" />
            今天
          </Button>
        )}
      </div>
      
      <TooltipProvider delayDuration={100}>
        <div className="flex gap-[3px] flex-wrap">
          {days.map((date) => {
            const level = getCompletionLevel(date)
            const isSelected = date === selectedDate
            const completedCount = records[date] 
              ? Object.values(records[date]).filter(r => r.status === 'completed').length 
              : 0
            
            return (
              <Tooltip key={date}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onDateChange(date)}
                    className={`
                      w-5 h-5 rounded-[3px] transition-all
                      ${levelColors[level]}
                      ${isSelected ? 'ring-1 ring-foreground ring-offset-1 ring-offset-background' : ''}
                      hover:ring-1 hover:ring-foreground/50
                    `}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs py-1 px-2">
                  <span>{date}</span>
                  <span className="text-muted-foreground ml-2">{completedCount}/{totalGames}</span>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </TooltipProvider>
      
      <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        <span>少</span>
        {levelColors.map((color, i) => (
          <div key={i} className={`w-3 h-3 rounded-[2px] ${color}`} />
        ))}
        <span>多</span>
      </div>
    </div>
  )
}
