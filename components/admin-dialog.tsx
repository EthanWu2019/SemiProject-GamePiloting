'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ADMIN_PASSWORD } from '@/lib/types'
import { Lock, LogOut } from 'lucide-react'

interface AdminDialogProps {
  isAdmin: boolean
  onLogin: () => void
  onLogout: () => void
}

export function AdminDialog({ isAdmin, onLogin, onLogout }: AdminDialogProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      onLogin()
      setOpen(false)
      setPassword('')
      setError('')
    } else {
      setError('密码错误')
    }
  }

  if (isAdmin) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onLogout}
        className="h-8 gap-1.5 text-xs"
      >
        <LogOut className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">退出</span>
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
          <Lock className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">管理</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">进入管理模式</DialogTitle>
          <DialogDescription className="text-sm">
            输入密码以更新游戏状态和管理任务
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
          <Input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            className="h-9 bg-secondary border-0"
            autoFocus
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" size="sm" className="h-9">
            确认
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
