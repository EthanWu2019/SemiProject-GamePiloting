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
      setError('密码错误，请重试')
    }
  }

  if (isAdmin) {
    return (
      <Button
        variant="outline"
        onClick={onLogout}
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        退出代肝模式
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Lock className="h-4 w-4" />
          代肝模式
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>进入代肝模式</DialogTitle>
          <DialogDescription>
            输入密码以进入管理模式，可以更新游戏状态
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            autoFocus
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full">
            确认
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
