export type GameStatus = 'pending' | 'in_progress' | 'completed'

export interface Game {
  id: string
  game_id: string
  name: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface GameRecord {
  status: GameStatus
  lastUpdate: string
}

export interface DailyRecord {
  [gameName: string]: GameRecord
}

export interface AllRecords {
  [date: string]: DailyRecord
}

export interface OneTimeTask {
  id: string
  title: string
  description: string | null
  status: GameStatus
  due_date: string | null
  created_at: string
  completed_at: string | null
}

export const STATUS_CONFIG = {
  pending: {
    label: '未开始',
    description: '代肝还没上线',
  },
  in_progress: {
    label: '进行中',
    description: '正在打每日任务',
  },
  completed: {
    label: '已完成',
    description: '今日每日/体力已清完',
  },
} as const

export const ADMIN_PASSWORD = 'wuyuzhe'
