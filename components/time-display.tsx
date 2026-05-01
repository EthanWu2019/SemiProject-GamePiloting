'use client'

import { useState, useEffect } from 'react'

function getBeijingTime(): Date {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc + 8 * 3600000)
}

function getCDTTime(): Date {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc - 5 * 3600000)
}

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[date.getDay()]
  return `${month}/${day} ${weekday}`
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
      <div className="h-24 flex items-center justify-center">
        <div className="text-muted-foreground text-sm">...</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-8 py-4 sm:py-6">
      {/* 北京时间 */}
      <div className="text-center space-y-1">
        <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">
          北京时间
        </div>
        <div className="text-3xl sm:text-6xl font-mono font-light tracking-tight tabular-nums">
          {formatTime(beijingTime)}
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground">
          {formatDate(beijingTime)}
        </div>
      </div>
      
      {/* 美国中部时间 */}
      <div className="text-center space-y-1">
        <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">
          美中 CDT
        </div>
        <div className="text-3xl sm:text-6xl font-mono font-light tracking-tight tabular-nums">
          {formatTime(cdtTime)}
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground">
          {formatDate(cdtTime)}
        </div>
      </div>
    </div>
  )
}
