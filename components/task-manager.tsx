'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Loader2, Trash2, Circle, CheckCircle2, PlayCircle } from 'lucide-react'
import type { OneTimeTask, GameStatus } from '@/lib/types'
import { addOneTimeTask, updateTaskStatus, deleteOneTimeTask } from '@/lib/storage'
import { cn } from '@/lib/utils'

interface TaskManagerProps {
  tasks: OneTimeTask[]
  isAdmin: boolean
  onUpdate: () => void
}

const statusIcons = {
  pending: Circle,
  in_progress: PlayCircle,
  completed: CheckCircle2,
}

const statusStyles = {
  pending: 'text-neutral-400',
  in_progress: 'text-amber-500',
  completed: 'text-emerald-500',
}

export function TaskManager({ tasks, isAdmin, onUpdate }: TaskManagerProps) {
  const [newTitle, setNewTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAdd = async () => {
    if (!newTitle.trim() || isAdding) return
    setIsAdding(true)
    const success = await addOneTimeTask(newTitle.trim())
    if (success) {
      setNewTitle('')
      onUpdate()
    }
    setIsAdding(false)
  }

  const handleStatusChange = async (taskId: string, currentStatus: GameStatus) => {
    const nextStatus: GameStatus = 
      currentStatus === 'pending' ? 'in_progress' :
      currentStatus === 'in_progress' ? 'completed' : 'pending'
    
    setLoadingId(taskId)
    await updateTaskStatus(taskId, nextStatus)
    onUpdate()
    setLoadingId(null)
  }

  const handleDelete = async (taskId: string) => {
    setDeletingId(taskId)
    await deleteOneTimeTask(taskId)
    onUpdate()
    setDeletingId(null)
  }

  // 过滤：客户只看未完成的
  const visibleTasks = isAdmin ? tasks : tasks.filter(t => t.status !== 'completed')

  if (!isAdmin && visibleTasks.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {isAdmin && (
        <div className="flex items-center gap-2">
          <Input
            placeholder="添加临时任务..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1 h-9 text-sm bg-secondary border-0"
          />
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!newTitle.trim() || isAdding}
            className="h-9 px-3"
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      )}

      <div className="space-y-1">
        {visibleTasks.map((task) => {
          const Icon = statusIcons[task.status]
          const isLoading = loadingId === task.id
          const isDeleting = deletingId === task.id

          return (
            <div
              key={task.id}
              className={cn(
                "flex items-center justify-between py-2.5 px-3 rounded-md transition-colors",
                isAdmin ? "bg-secondary/50 hover:bg-secondary" : "bg-card border border-border"
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
                ) : (
                  <button
                    onClick={() => isAdmin && handleStatusChange(task.id, task.status)}
                    disabled={!isAdmin}
                    className={cn("shrink-0", isAdmin && "cursor-pointer hover:opacity-70")}
                  >
                    <Icon className={cn("h-4 w-4", statusStyles[task.status])} />
                  </button>
                )}
                <span className={cn(
                  "text-sm truncate",
                  task.status === 'completed' && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </span>
              </div>
              
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                  disabled={isDeleting}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                >
                  {isDeleting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
