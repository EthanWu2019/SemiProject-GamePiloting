'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
      return <Circle className="h-5 w-5 text-red-400 fill-red-400" />
    case 'in_progress':
      return <PlayCircle className="h-5 w-5 text-yellow-400" />
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-green-400" />
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
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-card-foreground flex items-center justify-between">
          <span className="truncate">{gameName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <StatusIcon status={status} />
          <div>
            <p className={cn('font-semibold', config.textColor)}>
              {config.label}
            </p>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
        </div>

        {lastUpdate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Clock className="h-4 w-4" />
            <span>更新于 {formatUpdateTime(lastUpdate)}</span>
          </div>
        )}

        {isAdmin && onStatusChange && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <Button
              size="sm"
              variant={status === 'pending' ? 'default' : 'outline'}
              className={cn(
                'flex-1',
                status === 'pending' && 'bg-red-600 hover:bg-red-700'
              )}
              onClick={() => onStatusChange(gameId, 'pending')}
            >
              未开始
            </Button>
            <Button
              size="sm"
              variant={status === 'in_progress' ? 'default' : 'outline'}
              className={cn(
                'flex-1',
                status === 'in_progress' && 'bg-yellow-600 hover:bg-yellow-700'
              )}
              onClick={() => onStatusChange(gameId, 'in_progress')}
            >
              进行中
            </Button>
            <Button
              size="sm"
              variant={status === 'completed' ? 'default' : 'outline'}
              className={cn(
                'flex-1',
                status === 'completed' && 'bg-green-600 hover:bg-green-700'
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
