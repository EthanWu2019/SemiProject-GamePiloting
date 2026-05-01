'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { STATUS_CONFIG, type GameStatus } from '@/lib/types'
import { formatUpdateTime } from '@/lib/time'
import { Clock, Circle, CheckCircle2, PlayCircle } from 'lucide-react'

interface GameCardProps {
  gameId: string
  gameName: string
  status: GameStatus
  lastUpdate: string
  isAdmin: boolean
  onStatusChange?: (gameId: string, status: GameStatus) => void
}

const StatusIcon = ({ status }: { status: GameStatus }) => {
  switch (status) {
    case 'pending':
      return <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 fill-red-400 shrink-0" />
    case 'in_progress':
      return <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 shrink-0" />
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 shrink-0" />
  }
}

export function GameCard({
  gameId,
  gameName,
  status,
  lastUpdate,
  isAdmin,
  onStatusChange,
}: GameCardProps) {
  const config = STATUS_CONFIG[status]

  return (
    <Card className="bg-card border-border hover:border-primary/30 transition-colors">
      <CardContent className="p-3 sm:p-4">
        {/* 移动端紧凑布局 */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <StatusIcon status={status} />
            <div className="min-w-0">
              <p className="font-medium text-card-foreground text-sm sm:text-base truncate">
                {gameName}
              </p>
              <p className={cn('text-xs sm:text-sm', config.textColor)}>
                {config.label}
              </p>
            </div>
          </div>
          
          {lastUpdate && (
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="h-3 w-3" />
              <span>{formatUpdateTime(lastUpdate)}</span>
            </div>
          )}
        </div>

        {isAdmin && onStatusChange && (
          <div className="flex gap-1.5 sm:gap-2 mt-3 pt-3 border-t border-border">
            <Button
              size="sm"
              variant={status === 'pending' ? 'default' : 'outline'}
              className={cn(
                'flex-1 h-7 sm:h-8 text-xs sm:text-sm px-2',
                status === 'pending' && 'bg-red-600 hover:bg-red-700 text-white'
              )}
              onClick={() => onStatusChange(gameId, 'pending')}
            >
              未开始
            </Button>
            <Button
              size="sm"
              variant={status === 'in_progress' ? 'default' : 'outline'}
              className={cn(
                'flex-1 h-7 sm:h-8 text-xs sm:text-sm px-2',
                status === 'in_progress' && 'bg-yellow-600 hover:bg-yellow-700 text-white'
              )}
              onClick={() => onStatusChange(gameId, 'in_progress')}
            >
              进行中
            </Button>
            <Button
              size="sm"
              variant={status === 'completed' ? 'default' : 'outline'}
              className={cn(
                'flex-1 h-7 sm:h-8 text-xs sm:text-sm px-2',
                status === 'completed' && 'bg-green-600 hover:bg-green-700 text-white'
              )}
              onClick={() => onStatusChange(gameId, 'completed')}
            >
              已完成
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
