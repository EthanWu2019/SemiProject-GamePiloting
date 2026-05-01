'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { beijingToCDT, getBeijingDateString } from '@/lib/time'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

interface DateSelectorProps {
  selectedDate: string
  onDateChange: (date: string) => void
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const today = getBeijingDateString()
  const cdtTime = beijingToCDT(selectedDate)

  const goToPrevDay = () => {
    const [year, month, day] = selectedDate.split('-').map(Number)
    const date = new Date(year, month - 1, day - 1)
    onDateChange(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    )
  }

  const goToNextDay = () => {
    const [year, month, day] = selectedDate.split('-').map(Number)
    const date = new Date(year, month - 1, day + 1)
    onDateChange(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    )
  }

  const goToToday = () => {
    onDateChange(today)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevDay}
          className="shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <CalendarDays className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="flex-1"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNextDay}
          className="shrink-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {selectedDate !== today && (
          <Button
            variant="secondary"
            size="sm"
            onClick={goToToday}
            className="shrink-0"
          >
            回到今天
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span>北京时间: {selectedDate}</span>
        <span className="text-primary">|</span>
        <span>美国中部时间 (CDT): {cdtTime}</span>
      </div>
    </div>
  )
}
