import { createClient } from '@/lib/supabase/client'
import type { GameStatus, GameRecord, DailyRecord, AllRecords, Game, OneTimeTask } from './types'

// ============ 游戏管理 ============

// 获取所有游戏（包括未激活的）
export async function getAllGames(): Promise<Game[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('sort_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching games:', error)
    return []
  }
  return data || []
}

// 获取激活的游戏
export async function getActiveGames(): Promise<Game[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching active games:', error)
    return []
  }
  return data || []
}

// 添加新游戏
export async function addGame(gameId: string, name: string): Promise<boolean> {
  const supabase = createClient()
  const { data: maxOrder } = await supabase
    .from('games')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()
  
  const newOrder = (maxOrder?.sort_order || 0) + 1
  
  const { error } = await supabase
    .from('games')
    .insert({ game_id: gameId, name, sort_order: newOrder })
  
  if (error) {
    console.error('Error adding game:', error)
    return false
  }
  return true
}

// 切换游戏激活状态（软删除/恢复）
export async function toggleGameActive(gameId: string, isActive: boolean): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('games')
    .update({ is_active: isActive })
    .eq('game_id', gameId)
  
  if (error) {
    console.error('Error toggling game:', error)
    return false
  }
  return true
}

// ============ 游戏进度 ============

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

// ============ 单次任务 ============

// 获取所有单次任务
export async function getOneTimeTasks(): Promise<OneTimeTask[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('one_time_tasks')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
  return data || []
}

// 获取未完成的单次任务
export async function getPendingTasks(): Promise<OneTimeTask[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('one_time_tasks')
    .select('*')
    .neq('status', 'completed')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching pending tasks:', error)
    return []
  }
  return data || []
}

// 添加单次任务
export async function addOneTimeTask(
  title: string,
  description?: string,
  dueDate?: string
): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('one_time_tasks')
    .insert({
      title,
      description: description || null,
      due_date: dueDate || null,
    })
  
  if (error) {
    console.error('Error adding task:', error)
    return false
  }
  return true
}

// 更新单次任务状态
export async function updateTaskStatus(
  taskId: string,
  status: GameStatus
): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('one_time_tasks')
    .update({
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    })
    .eq('id', taskId)
  
  if (error) {
    console.error('Error updating task:', error)
    return false
  }
  return true
}

// 删除单次任务
export async function deleteOneTimeTask(taskId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('one_time_tasks')
    .delete()
    .eq('id', taskId)
  
  if (error) {
    console.error('Error deleting task:', error)
    return false
  }
  return true
}
