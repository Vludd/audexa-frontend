import { Download, RefreshCw, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { LogEntry } from "@/types"

export type LogFilter = "all" | "INFO" | "WARNING" | "ERROR"

interface Props {
  filter: LogFilter
  logs: LogEntry[]
  onFilterChange: (filter: LogFilter) => void
  onRefresh?: () => void
  onExport?: () => void
  onClear?: () => void
}

const FILTERS: {
  value: LogFilter
  label: string
}[] = [
  { value: "all", label: "Все" },
  { value: "INFO", label: "Информация" },
  { value: "WARNING", label: "Предупреждения" },
  { value: "ERROR", label: "Ошибки" },
]

const ACTIVE_CLASS: Record<LogFilter, string> = {
  all: "bg-primary text-primary-foreground",
  INFO: "bg-blue-600 text-white hover:bg-blue-700",
  WARNING: "bg-amber-500 text-white hover:bg-amber-600",
  ERROR: "bg-red-600 text-white hover:bg-red-700",
}

export default function LogsToolbar({
  filter,
  logs,
  onFilterChange,
  onRefresh,
  onExport,
  onClear,
}: Props) {
  const count = (level: LogFilter) =>
    level === "all"
      ? logs.length
      : logs.filter((log) => log.level === level).length

  return (
    <div className="flex items-center gap-2 border-b bg-card px-4 py-2">
      <div className="flex items-center gap-1.5">
        {FILTERS.map((item) => {
          const active = filter === item.value

          return (
            <Button
              key={item.value}
              variant={active ? "default" : "outline"}
              size="sm"
              className={active ? ACTIVE_CLASS[item.value] : ""}
              onClick={() => onFilterChange(item.value)}
            >
              {item.label} ({count(item.value)})
            </Button>
          )
        })}
      </div>

      <div className="flex-1" />

      <Button variant="outline" size="sm" onClick={onRefresh}>
        <RefreshCw className="size-3.5" />
        Обновить
      </Button>

      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="size-3.5" />
        Экспорт
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="text-destructive hover:text-destructive"
        onClick={onClear}
      >
        <Trash2 className="size-3.5" />
        Очистить
      </Button>
    </div>
  )
}