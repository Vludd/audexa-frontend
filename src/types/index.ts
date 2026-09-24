export type RoomStatus =
  | "idle"
  | "playing"
  | "paused"
  | "stopped"
  | "waiting"
  | "error"

export type RoomOperation =
  | "starting"
  | "stopping"
  | "pausing"

export interface Room {
  id: number
  name: string
  status: RoomStatus
  operation?: RoomOperation
  file: string
  volume: number
  position: number // seconds
  duration: number // seconds
  isSyncTranslation?: boolean
}

export interface ScenarioStep {
  id: number
  roomId: number
  roomName: string
  file: string
  volume: number
  delay: number // seconds
  duration: number // seconds
}

export type ScenarioStatus = "active" | "inactive"

export interface Scenario {
  id: number
  name: string
  description: string
  steps: ScenarioStep[]
  status: ScenarioStatus
  playMode: string
  repeat: string
  autoStart: boolean
  stopPrevious: boolean
  syncTranslation: boolean
  crossfade: boolean
  notifications: boolean
}

export type ScheduleRepeat = "daily" | "weekly" | "once"
export type ScheduleStatus = "active" | "inactive"

export interface ScheduleItem {
  id: number
  enabled: boolean
  time: string
  scenarioId: number
  scenarioName: string
  days: string[]
  repeat: ScheduleRepeat
  nextRun: string
  status: ScheduleStatus
}

export interface AudioFile {
  id: number
  name: string
  filename: string
  format: string
  sampleRate: number
  duration: number // seconds
  size: number // bytes
}

export interface LogEntry {
  id: number
  time: string
  level: "INFO" | "WARNING" | "ERROR"
  message: string
}

export interface SystemStatus {
  device: string
  online: boolean
  outputs: number
  sampleRate: number
  bufferSize: number
}

export type Page =
  | "dashboard"
  | "rooms"
  | "scenarios"
  | "schedule"
  | "audiofiles"
  | "settings"
  | "logs"
