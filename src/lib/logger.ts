import type { LogEntry, LogLevel, LogSource } from "@/types"
import { formatTime as formatLocalizedTime, t } from "@/i18n"

const STORAGE_KEY = "audexa.frontend.logs.v1"

const LOG_RETENTION_DAYS = 7
const MAX_LOGS = 2000
const LOG_RETENTION_MS = LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000

type LogContext = Record<string, unknown>

type LogInput = {
  level: LogLevel
  source: LogSource
  event: string
  message: string
  context?: LogContext
}

let entries: LogEntry[] = loadLogs()
const listeners = new Set<() => void>()

function loadLogs(): LogEntry[] {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return cleanupLogs(parsed.filter(isLogEntry))
  } catch {
    return []
  }
}

function isLogEntry(value: unknown): value is LogEntry {
  if (!value || typeof value !== "object") {
    return false
  }

  const entry = value as Partial<LogEntry>

  return (
    typeof entry.id === "string" &&
    typeof entry.timestamp === "string" &&
    typeof entry.time === "string" &&
    typeof entry.level === "string" &&
    typeof entry.source === "string" &&
    typeof entry.event === "string" &&
    typeof entry.message === "string"
  )
}

function cleanupLogs(logs: LogEntry[]): LogEntry[] {
  const cutoff = Date.now() - LOG_RETENTION_MS

  return logs
    .filter((entry) => {
      const timestamp = Date.parse(entry.timestamp)

      if (Number.isNaN(timestamp)) {
        return false
      }

      return timestamp >= cutoff
    })
    .sort(
      (a, b) =>
        Date.parse(a.timestamp) - Date.parse(b.timestamp),
    )
    .slice(-MAX_LOGS)
}

function persist() {
  if (typeof window === "undefined") {
    return
  }

  try {
    const cleaned = cleanupLogs(entries)

    entries = cleaned

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(entries),
    )
  } catch {
    // Logging must never break the application
    // if localStorage is unavailable.
  }
}

function emit() {
  listeners.forEach((listener) => listener())
}

function formatTime(timestamp: Date) {
  return formatLocalizedTime(timestamp)
}

function sanitizeContext(context?: LogContext) {
  if (!context) {
    return undefined
  }

  try {
    JSON.stringify(context)
    return context
  } catch {
    return {
      serializationError: t("logs.messages.contextSerializationError"),
    }
  }
}

function write(input: LogInput) {
  const now = new Date()

  const entry: LogEntry = {
    id: `${now.getTime()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    timestamp: now.toISOString(),
    time: formatTime(now),
    level: input.level,
    source: input.source,
    event: input.event,
    message: input.message,
    context: sanitizeContext(input.context),
  }

  entries = cleanupLogs([...entries, entry])

  persist()
  emit()

  return entry
}

export const logger = {
  debug(
    source: LogSource,
    event: string,
    message: string,
    context?: LogContext,
  ) {
    return write({
      level: "DEBUG",
      source,
      event,
      message,
      context,
    })
  },

  info(
    source: LogSource,
    event: string,
    message: string,
    context?: LogContext,
  ) {
    return write({
      level: "INFO",
      source,
      event,
      message,
      context,
    })
  },

  warn(
    source: LogSource,
    event: string,
    message: string,
    context?: LogContext,
  ) {
    return write({
      level: "WARNING",
      source,
      event,
      message,
      context,
    })
  },

  error(
    source: LogSource,
    event: string,
    message: string,
    context?: LogContext,
  ) {
    return write({
      level: "ERROR",
      source,
      event,
      message,
      context,
    })
  },
}

export function getLogs() {
  return entries
}

export function clearLogs() {
  entries = []
  persist()
  emit()
}

export function removeLog(id: string) {
  entries = entries.filter((entry) => entry.id !== id)
  persist()
  emit()
}

export function subscribeLogs(listener: () => void) {
  listeners.add(listener)

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) {
      return
    }

    entries = loadLogs()
    listener()
  }

  window.addEventListener("storage", handleStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", handleStorage)
  }
}

export function exportLogs(
  format: "json" | "csv" | "txt" = "json",
) {
  if (format === "json") {
    return JSON.stringify(entries, null, 2)
  }

  if (format === "txt") {
    return entries
      .map(
        (entry) =>
          `${entry.timestamp} [${entry.level}] [${entry.source}] ${entry.event}: ${entry.message}`,
      )
      .join("\n")
  }

  const header =
    "timestamp,time,level,source,event,message"

  const rows = entries.map((entry) =>
    [
      entry.timestamp,
      entry.time,
      entry.level,
      entry.source,
      entry.event,
      entry.message,
    ]
      .map(csvEscape)
      .join(","),
  )

  return [header, ...rows].join("\n")
}

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`
}