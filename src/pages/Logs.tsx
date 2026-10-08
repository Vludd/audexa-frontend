import { useMemo, useState } from "react"

import type { LogEntry } from "@/types"
import Header from "@/components/Header"
import LogsToolbar, {
  type LogFilter,
} from "@/components/logs/LogsToolbar"
import LogViewer from "@/components/logs/LogViewer"

interface Props {
  logs: LogEntry[]
  onClear?: () => void
}

export default function Logs({ logs, onClear }: Props) {
  const [filter, setFilter] = useState<LogFilter>("all")
  const [query, setQuery] = useState("")
  const [includeDebug, setIncludeDebug] = useState(false)

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return [...logs]
      .sort(
        (a, b) =>
          Date.parse(b.timestamp) - Date.parse(a.timestamp),
      )
      .filter((log) => {
        if (
          !includeDebug &&
          filter === "all" &&
          log.level === "DEBUG"
        ) {
          return false
        }

        const matchesLevel =
          filter === "all" || log.level === filter

        if (!matchesLevel) {
          return false
        }

        if (!normalizedQuery) {
          return true
        }

        return [
          log.message,
          log.event,
          log.source,
          JSON.stringify(log.context ?? {}),
        ].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        )
      })
  }, [filter, includeDebug, logs, query])

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header
        title="Журнал событий"
        subtitle="Frontend: действия интерфейса, API, сеть и ошибки выполнения"
      />

      <LogsToolbar
        filter={filter}
        logs={logs}
        query={query}
        includeDebug={includeDebug}
        onQueryChange={setQuery}
        onFilterChange={setFilter}
        onIncludeDebugChange={setIncludeDebug}
        onClear={onClear}
      />

      <div className="min-h-0 flex-1 overflow-auto p-4">
        <LogViewer logs={filtered} />

        <div className="mt-2 text-xs text-muted-foreground">
          Записей: {filtered.length} из {logs.length}
        </div>
      </div>
    </div>
  )
}