import { useState } from "react"

import type { LogEntry } from "@/types"
import Header from "@/components/Header"
import LogsToolbar, {
  type LogFilter,
} from "@/components/logs/LogsToolbar"
import LogViewer from "@/components/logs/LogViewer"

interface Props {
  logs: LogEntry[]
}

export default function Logs({ logs }: Props) {
  const [filter, setFilter] = useState<LogFilter>("all")

  const filtered =
    filter === "all"
      ? logs
      : logs.filter((log) => log.level === filter)

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header
        title="Журнал событий"
        subtitle="История действий и системных сообщений"
      />

      <LogsToolbar
        filter={filter}
        logs={logs}
        onFilterChange={setFilter}
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