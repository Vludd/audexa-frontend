import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { LogEntry } from "@/types"

interface DashboardIssuesProps {
  logs: LogEntry[]
  onNavigate: (page: string) => void
}

export default function DashboardIssues({
  logs,
  onNavigate,
}: DashboardIssuesProps) {
  const issues = [...logs]
    .filter(
      (log) =>
        log.level === "ERROR" || log.level === "WARNING",
    )
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold">
          Последние проблемы
        </h3>

        <Button
          variant="link"
          className="h-auto p-0 text-xs"
          onClick={() => onNavigate("logs")}
        >
          Открыть журнал →
        </Button>
      </div>

      <div className="p-3.5">
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="mb-2 size-7 text-muted-foreground/50" />

            <div className="text-sm text-muted-foreground">
              Проблем не обнаружено
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {issues.map((log, index) => {
              const isError = log.level === "ERROR"

              return (
                <div key={log.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate("logs")}
                    className="flex min-w-0 w-full items-center gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-muted/60"
                  >
                    {isError ? (
                      <XCircle className="size-4 shrink-0 text-destructive" />
                    ) : (
                      <AlertTriangle className="size-4 shrink-0 text-amber-500" />
                    )}

                    <span className="w-16 shrink-0 text-xs tabular-nums text-muted-foreground">
                      {log.time}
                    </span>

                    <span className="min-w-0 flex-1 truncate text-sm">
                      {log.message}
                    </span>

                    <Badge
                      variant={
                        isError ? "destructive" : "secondary"
                      }
                      className="hidden shrink-0 sm:inline-flex"
                    >
                      {log.level}
                    </Badge>
                  </button>

                  {index < issues.length - 1 && (
                    <div className="h-px bg-border" />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}