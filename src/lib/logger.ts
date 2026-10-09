import type { LogEntry, LogLevel, LogSource } from "@/types"
import { formatTime as formatLocalizedTime, t } from "@/i18n"

const STORAGE_KEY = "audexa.frontend.logs.v1"
const SETTINGS_STORAGE_KEY =
  "audexa.frontend.logging.settings.v1"

const LOG_RETENTION_DAYS = 7
const MAX_LOGS = 2000
const LOG_RETENTION_MS =
  LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000

type LogContext = Record<string, unknown>

type LogInput = {
  level: LogLevel
  source: LogSource
  event: string
  message: string
  context?: LogContext
}

export interface LoggingSettings {
  level: LogLevel
}

export type LogStorageInfo =
  | {
      type: "localStorage"
      label: string
      description: string
    }
  | {
      type: "file"
      label: string
      description: string
      path: string
    }

interface AudexaLogStorageInfo {
  type: "file"
  path: string
}

declare global {
  interface Window {
    __AUDEXA_LOG_STORAGE__?: AudexaLogStorageInfo
  }
}

const DEFAULT_LOGGING_SETTINGS: LoggingSettings = {
  level: "INFO",
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
}

let loggingSettings = loadLoggingSettings()
let entries: LogEntry[] = loadLogs()

const listeners = new Set<() => void>()
const settingsListeners = new Set<() => void>()

function isLogLevel(value: unknown): value is LogLevel {
  return (
    value === "DEBUG" ||
    value === "INFO" ||
    value === "WARNING" ||
    value === "ERROR"
  )
}


function loadLoggingSettings(): LoggingSettings {
  if (typeof window === "undefined") {
    return DEFAULT_LOGGING_SETTINGS
  }

  try {
    const raw = window.localStorage.getItem(
      SETTINGS_STORAGE_KEY,
    )

    if (!raw) {
      return DEFAULT_LOGGING_SETTINGS
    }

    const parsed = JSON.parse(raw)

    if (
      parsed &&
      typeof parsed === "object" &&
      isLogLevel(parsed.level)
    ) {
      return {
        level: parsed.level,
      }
    }
  } catch {
    // Fall back to defaults.
  }

  return DEFAULT_LOGGING_SETTINGS
}

function persistLoggingSettings() {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(loggingSettings),
    )
  } catch {
    // Logging settings must never break the application.
  }
}

function emitSettings() {
  settingsListeners.forEach((listener) => listener())
}

export function getLoggingSettings(): LoggingSettings {
  return loggingSettings
}

export function setLoggingLevel(level: LogLevel) {
  if (loggingSettings.level === level) {
    return
  }

  loggingSettings = {
    ...loggingSettings,
    level,
  }

  persistLoggingSettings()
  emitSettings()
}

export function subscribeLoggingSettings(
  listener: () => void,
) {
  settingsListeners.add(listener)

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== SETTINGS_STORAGE_KEY) {
      return
    }

    loggingSettings = loadLoggingSettings()
    listener()
  }

  window.addEventListener("storage", handleStorage)

  return () => {
    settingsListeners.delete(listener)

    window.removeEventListener(
      "storage",
      handleStorage,
    )
  }
}


/**
 * Returns information about the actual log storage.
 *
 * Current implementation:
 *   localStorage
 *
 * Future native implementation:
 *   C# WebView2 shell can expose:
 *
 *   window.__AUDEXA_LOG_STORAGE__ = {
 *     type: "file",
 *     path: "C:\\Users\\...\\AppData\\Roaming\\Audexa\\logs"
 *   }
 *
 * The Settings UI will automatically display the file path
 * without knowing anything about the native implementation.
 */
export function getLogStorageInfo(): LogStorageInfo {
  if (typeof window !== "undefined") {
    const nativeStorage =
      window.__AUDEXA_LOG_STORAGE__

    if (
      nativeStorage?.type === "file" &&
      typeof nativeStorage.path === "string" &&
      nativeStorage.path.trim()
    ) {
      return {
        type: "file",
        label: t("settings.logging.storage.file"),
        description: t(
          "settings.logging.storage.fileDescription",
        ),
        path: nativeStorage.path,
      }
    }
  }

  return {
    type: "localStorage",
    label: t("settings.logging.storage.localStorage"),
    description: t(
      "settings.logging.storage.localStorageDescription",
    ),
  }
}


function shouldWrite(level: LogLevel) {
  return (
    LOG_LEVEL_PRIORITY[level] >=
    LOG_LEVEL_PRIORITY[loggingSettings.level]
  )
}


function loadLogs(): LogEntry[] {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const raw = window.localStorage.getItem(
      STORAGE_KEY,
    )

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return cleanupLogs(
      parsed.filter(isLogEntry),
    )
  } catch {
    return []
  }
}

function isLogEntry(
  value: unknown,
): value is LogEntry {
  if (!value || typeof value !== "object") {
    return false
  }

  const entry = value as Partial<LogEntry>

  return (
    typeof entry.id === "string" &&
    typeof entry.timestamp === "string" &&
    typeof entry.time === "string" &&
    isLogLevel(entry.level) &&
    typeof entry.source === "string" &&
    typeof entry.event === "string" &&
    typeof entry.message === "string"
  )
}

function cleanupLogs(
  logs: LogEntry[],
): LogEntry[] {
  const cutoff =
    Date.now() - LOG_RETENTION_MS

  return logs
    .filter((entry) => {
      const timestamp = Date.parse(
        entry.timestamp,
      )

      if (Number.isNaN(timestamp)) {
        return false
      }

      return timestamp >= cutoff
    })
    .sort(
      (a, b) =>
        Date.parse(a.timestamp) -
        Date.parse(b.timestamp),
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

function sanitizeContext(
  context?: LogContext,
) {
  if (!context) {
    return undefined
  }

  try {
    JSON.stringify(context)

    return context
  } catch {
    return {
      serializationError: t(
        "logs.messages.contextSerializationError",
      ),
    }
  }
}

function write(input: LogInput) {
  /*
   * Log level is a recording threshold.
   *
   * DEBUG   -> DEBUG + INFO + WARNING + ERROR
   * INFO    -> INFO + WARNING + ERROR
   * WARNING -> WARNING + ERROR
   * ERROR   -> ERROR
   */

  if (!shouldWrite(input.level)) {
    return undefined
  }

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

    context: sanitizeContext(
      input.context,
    ),
  }

  entries = cleanupLogs([
    ...entries,
    entry,
  ])

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
  entries = entries.filter(
    (entry) => entry.id !== id,
  )

  persist()
  emit()
}

export function subscribeLogs(
  listener: () => void,
) {
  listeners.add(listener)

  const handleStorage = (
    event: StorageEvent,
  ) => {
    if (event.key !== STORAGE_KEY) {
      return
    }

    entries = loadLogs()

    listener()
  }

  window.addEventListener(
    "storage",
    handleStorage,
  )

  return () => {
    listeners.delete(listener)

    window.removeEventListener(
      "storage",
      handleStorage,
    )
  }
}


export function exportLogs(
  format: "json" | "csv" | "txt" = "json",
) {
  if (format === "json") {
    return JSON.stringify(
      entries,
      null,
      2,
    )
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

  return [
    header,
    ...rows,
  ].join("\n")
}

function csvEscape(
  value: string,
) {
  return `"${value.replace(
    /"/g,
    '""',
  )}"`
}