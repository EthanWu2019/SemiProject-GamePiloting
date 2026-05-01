import type { AllRecords, DailyRecord, GameStatus, GameRecord } from './types'

const STORAGE_KEY = 'gamepiloting_records'

export function getAllRecords(): AllRecords {
  if (typeof window === 'undefined') return {}
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

export function getDailyRecord(date: string): DailyRecord {
  const allRecords = getAllRecords()
  return allRecords[date] || {}
}

export function updateGameStatus(
  date: string,
  gameId: string,
  status: GameStatus
): void {
  const allRecords = getAllRecords()
  
  if (!allRecords[date]) {
    allRecords[date] = {}
  }
  
  const now = new Date()
  // 转换为北京时间
  const beijingTime = new Date(now.getTime() + (8 * 60 * 60 * 1000) - (now.getTimezoneOffset() * 60 * 1000))
  
  allRecords[date][gameId] = {
    status,
    lastUpdate: beijingTime.toISOString(),
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allRecords))
}

export function getGameRecord(date: string, gameId: string): GameRecord {
  const dailyRecord = getDailyRecord(date)
  return dailyRecord[gameId] || { status: 'pending', lastUpdate: '' }
}
