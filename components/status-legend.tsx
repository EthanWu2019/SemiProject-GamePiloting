import { Circle, PlayCircle, CheckCircle2 } from 'lucide-react'

export function StatusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-4 py-3">
      <span className="text-foreground font-medium">状态说明:</span>
      <div className="flex items-center gap-1.5">
        <Circle className="h-4 w-4 text-red-400 fill-red-400" />
        <span>未开始</span>
      </div>
      <div className="flex items-center gap-1.5">
        <PlayCircle className="h-4 w-4 text-yellow-400" />
        <span>进行中</span>
      </div>
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="h-4 w-4 text-green-400" />
        <span>已完成</span>
      </div>
    </div>
  )
}
