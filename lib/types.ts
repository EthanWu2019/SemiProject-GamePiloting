export type GameStatus = 'pending' | 'in_progress' | 'completed'

export interface GameRecord {
  status: GameStatus
  lastUpdate: string // ISO timestamp
}

export interface DailyRecord {
  [gameName: string]: GameRecord
}

export interface AllRecords {
  [date: string]: DailyRecord // date format: YYYY-MM-DD
}

export const GAMES = [
  { id: 'genshin', name: '原神（国际服）' },
  { id: 'hsr', name: '崩坏：星穹铁道（国服）' },
  { id: 'wuwa', name: '鸣潮（国服）' },
  { id: 'arknights', name: '明日方舟（国服）' },
  { id: 'arknights-endfield', name: '明日方舟：终末地（国服）' },
] as const

export const STATUS_CONFIG = {
  pending: {
    label: '未开始',
    description: '代肝还没上线',
    color: 'bg-red-500',
    textColor: 'text-red-400',
  },
  in_progress: {
    label: '进行中',
    description: '正在打每日任务',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-400',
  },
  completed: {
    label: '已完成',
    description: '今日每日/体力已清完',
    color: 'bg-green-500',
    textColor: 'text-green-400',
  },
} as const

export const ADMIN_PASSWORD = 'daily123'
