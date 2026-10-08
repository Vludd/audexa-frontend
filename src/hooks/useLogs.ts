import { useCallback, useSyncExternalStore } from "react"

import {
  clearLogs as clearStoredLogs,
  getLogs,
  logger,
  removeLog as removeStoredLog,
  subscribeLogs,
} from "@/lib/logger"

export function useLogs() {
  const logs = useSyncExternalStore(
    subscribeLogs,
    getLogs,
    getLogs,
  )

  const addLog = useCallback(
    (...args: Parameters<typeof logger.info>) => logger.info(...args),
    [],
  )

  const removeLog = useCallback((id: string) => {
    removeStoredLog(id)
  }, [])

  const clearLogs = useCallback(() => {
    clearStoredLogs()
  }, [])

  return {
    logs,
    addLog,
    removeLog,
    clearLogs,
  }
}
