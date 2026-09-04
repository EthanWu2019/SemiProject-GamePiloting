'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { STATUS_CONFIG, type GameStatus } from '@/lib/types'
import { Circle, CheckCircle2, PlayCircle, Loader2 } from 'lucide-react'

interface GameCardProps {
  gameId: string
  gameName: string
  status: GameStatus
  isAdmin: boolean
  onStatusChange?: (gameId: string, status: GameStatus) => void | Promise<void>
}

const statusIcons = {
  pending: Circle,
  in_progress: PlayCircle,
  completed: CheckCircle2,
}

const statusColors = {
  pending: 'text-neutral-400',
  in_progress: 'text-amber-500',
  completed: 'text-emerald-500',
}

export function GameCard({
  gameId,
  gameName,
  status,
  isAdmin,
  onStatusChange,
}: GameCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const config = STATUS_CONFIG[status]
  const Icon = statusIcons[status]

  const handleStatusChange = async (newStatus: GameStatus) => {
    if (!onStatusChange || isUpdating) return
    setIsUpdating(true)
    try {
      await onStatusChange(gameId, newStatus)
    } finally {
      setIsUpdating(false)
    }
  }

  // 客户视图 - 简洁的一行显示
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-card border border-border">
        <span className="text-sm font-medium">{gameName}</span>
        <div className="flex items-center gap-2">
          <span className={cn("text-xs", statusColors[status])}>{config.label}</span>
          <Icon className={cn("h-4 w-4", statusColors[status])} />
        </div>
      </div>
    )
  }

  // 管理员视图 - 带操作按钮
  return (
    <div className="p-4 rounded-lg bg-card border border-border space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isUpdating ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <Icon className={cn("h-5 w-5", statusColors[status])} />
          )}
          <span className="font-medium">{gameName}</span>
        </div>
        <span className={cn("text-sm", statusColors[status])}>{config.label}</span>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant={status === 'pending' ? 'default' : 'outline'}
          className={cn(
            'flex-1 h-8 text-xs',
            status === 'pending' && 'bg-neutral-500 hover:bg-neutral-600 text-white border-0'
          )}
          onClick={() => handleStatusChange('pending')}
          disabled={isUpdating}
        >
          未开始
        </Button>
        <Button
          size="sm"
          variant={status === 'in_progress' ? 'default' : 'outline'}
          className={cn(
            'flex-1 h-8 text-xs',
            status === 'in_progress' && 'bg-amber-500 hover:bg-amber-600 text-white border-0'
          )}
          onClick={() => handleStatusChange('in_progress')}
          disabled={isUpdating}
        >
          进行中
        </Button>
        <Button
          size="sm"
          variant={status === 'completed' ? 'default' : 'outline'}
          className={cn(
            'flex-1 h-8 text-xs',
            status === 'completed' && 'bg-emerald-500 hover:bg-emerald-600 text-white border-0'
          )}
          onClick={() => handleStatusChange('completed')}
          disabled={isUpdating}
        >
          已完成
        </Button>
      </div>
    </div>
  )
}
