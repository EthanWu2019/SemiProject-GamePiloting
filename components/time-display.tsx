'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

function getBeijingTime(): Date {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc + 8 * 3600000)
}

function getCDTTime(): Date {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  // CDT = UTC - 5
  return new Date(utc - 5 * 3600000)
}

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function TimeDisplay() {
  const [beijingTime, setBeijingTime] = useState<Date | null>(null)
  const [cdtTime, setCdtTime] = useState<Date | null>(null)

  useEffect(() => {
    const updateTime = () => {
      setBeijingTime(getBeijingTime())
      setCdtTime(getCDTTime())
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!beijingTime || !cdtTime) {
    return (
      <div className="flex items-center justify-center gap-8 py-6">
        <div className="text-muted-foreground">加载时间...</div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <span className="text-sm text-muted-foreground font-medium">当前时间</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* 北京时间 */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
            北京时间 (UTC+8)
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-foreground tabular-nums">
            {formatTime(beijingTime)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {formatDate(beijingTime)}
          </div>
        </div>
        
        {/* 美国中部时间 */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
            美国中部时间 (CDT)
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-foreground tabular-nums">
            {formatTime(cdtTime)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {formatDate(cdtTime)}
          </div>
        </div>
      </div>
    </div>
  )
}
