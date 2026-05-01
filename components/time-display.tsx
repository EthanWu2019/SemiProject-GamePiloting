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
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[date.getDay()]
  return `${year}年${month}月${day}日 ${weekday}`
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
      <div className="flex items-center justify-center py-4 sm:py-6">
        <div className="text-muted-foreground">加载时间...</div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        {/* 北京时间 */}
        <div className="text-center">
          <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2 uppercase tracking-wider">
            北京时间
          </div>
          <div className="text-2xl sm:text-5xl font-mono font-bold text-foreground tabular-nums leading-none">
            {formatTime(beijingTime)}
          </div>
          <div className="text-[10px] sm:text-sm text-muted-foreground mt-1 sm:mt-2">
            {formatDate(beijingTime)}
          </div>
        </div>
        
        {/* 美国中部时间 */}
        <div className="text-center">
          <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2 uppercase tracking-wider">
            美国中部 CDT
          </div>
          <div className="text-2xl sm:text-5xl font-mono font-bold text-foreground tabular-nums leading-none">
            {formatTime(cdtTime)}
          </div>
          <div className="text-[10px] sm:text-sm text-muted-foreground mt-1 sm:mt-2">
            {formatDate(cdtTime)}
          </div>
        </div>
      </div>
    </div>
  )
}
