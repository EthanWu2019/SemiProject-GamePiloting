import { createClient } from '@/lib/supabase/client'
import type { GameStatus, GameRecord, DailyRecord, AllRecords } from './types'

// 获取指定日期的所有游戏记录
export async function getDailyRecord(date: string): Promise<DailyRecord> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('game_progress')
    .select('game_id, status, updated_at')
    .eq('date', date)
  
  if (error) {
    console.error('Error fetching daily record:', error)
    return {}
  }
  
  const records: DailyRecord = {}
  data?.forEach((row) => {
    records[row.game_id] = {
      status: row.status as GameStatus,
      lastUpdate: row.updated_at,
    }
  })
  
  return records
}

// 获取单个游戏记录
export async function getGameRecord(date: string, gameId: string): Promise<GameRecord> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('game_progress')
    .select('status, updated_at')
    .eq('date', date)
    .eq('game_id', gameId)
    .single()
  
  if (error || !data) {
    return { status: 'pending', lastUpdate: '' }
  }
  
  return {
    status: data.status as GameStatus,
    lastUpdate: data.updated_at,
  }
}

// 更新游戏状态
export async function updateGameStatus(
  date: string,
  gameId: string,
  status: GameStatus
): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('game_progress')
    .upsert(
      {
        date,
        game_id: gameId,
        status,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'date,game_id',
      }
    )
  
  if (error) {
    console.error('Error updating game status:', error)
    return false
  }
  
  return true
}

// 获取一段时间内的所有记录（用于贡献图）
export async function getRecordsInRange(
  startDate: string,
  endDate: string
): Promise<AllRecords> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('game_progress')
    .select('date, game_id, status, updated_at')
    .gte('date', startDate)
    .lte('date', endDate)
  
  if (error) {
    console.error('Error fetching records:', error)
    return {}
  }
  
  const records: AllRecords = {}
  data?.forEach((row) => {
    if (!records[row.date]) {
      records[row.date] = {}
    }
    records[row.date][row.game_id] = {
      status: row.status as GameStatus,
      lastUpdate: row.updated_at,
    }
  })
  
  return records
}
