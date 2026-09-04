// 获取当前北京时间的日期字符串 (YYYY-MM-DD)
export function getBeijingDateString(date?: Date): string {
  const d = date || new Date()
  // 获取 UTC 时间，然后加上8小时得到北京时间
  const utc = d.getTime() + d.getTimezoneOffset() * 60000
  const beijing = new Date(utc + 8 * 3600000)
  return formatDateString(beijing)
}

// 格式化日期为 YYYY-MM-DD
export function formatDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 将北京时间日期转换为美国中部时间显示
export function beijingToCDT(beijingDateStr: string): string {
  // 假设北京时间是当天的 00:00
  // 北京时间 = UTC + 8
  // CDT = UTC - 5 (夏令时) 或 CST = UTC - 6 (标准时间)
  // 北京时间比 CDT 早 13 小时
  
  const [year, month, day] = beijingDateStr.split('-').map(Number)
  const beijingMidnight = new Date(Date.UTC(year, month - 1, day, -8, 0, 0)) // UTC 时间
  
  // 简单处理：假设使用夏令时 CDT (UTC-5)
  // 实际应该根据日期判断是否在夏令时期间
  const cdtOffset = -5 // CDT 偏移
  const cdtTime = new Date(beijingMidnight.getTime() + cdtOffset * 3600000)
  
  const cdtYear = cdtTime.getUTCFullYear()
  const cdtMonth = String(cdtTime.getUTCMonth() + 1).padStart(2, '0')
  const cdtDay = String(cdtTime.getUTCDate()).padStart(2, '0')
  const cdtHour = String(cdtTime.getUTCHours()).padStart(2, '0')
  const cdtMinute = String(cdtTime.getUTCMinutes()).padStart(2, '0')
  
  return `${cdtYear}-${cdtMonth}-${cdtDay} ${cdtHour}:${cdtMinute}`
}

// 格式化更新时间显示
export function formatUpdateTime(isoString: string): string {
  if (!isoString) return ''
  try {
    const date = new Date(isoString)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  } catch {
    return ''
  }
}

// 检查是否是未来日期（相对于北京时间）
export function isFutureDate(dateStr: string): boolean {
  const today = getBeijingDateString()
  return dateStr > today
}
