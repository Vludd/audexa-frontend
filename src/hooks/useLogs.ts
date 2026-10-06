import { mockLogs } from "@/data/mock";
import { LogEntry } from "@/types";
import { useCallback, useState } from "react";


export function useLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs)

  const addLog = useCallback((log: LogEntry) => {
    setLogs((currentLogs) => [...currentLogs, log])
  }, [])

  const removeLog = useCallback((id: number) => {
    setLogs((currentLogs) => currentLogs.filter((log) => log.id !== id))
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  return {
    logs,
    addLog,
    removeLog,
    clearLogs,
  }
}