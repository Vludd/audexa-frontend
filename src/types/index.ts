export type EntityId = string

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
  id: EntityId;
  name: string;
  status: RoomStatus;
  operation?: RoomOperation;
  audioFileId: EntityId | null;
  volume: number;
  position: number; // seconds
  duration: number; // seconds
}

export interface ScenarioStep {
  id: number;
  roomId: EntityId;
  roomName: string;
  file: string;
  volume: number;
  delay: number; // seconds
  duration: number; // seconds
}

export type ScenarioStatus = "active" | "inactive"
export type ScenarioPlayMode = "sequential" | "parallel"
export type ScenarioRepeat = "once" | "loop"

export interface Scenario {
  id: number
  name: string
  description: string
  steps: ScenarioStep[]
  status: ScenarioStatus
  playMode: ScenarioPlayMode
  repeat: ScenarioRepeat
  autoStart: boolean
  stopPrevious: boolean
  syncTranslation: boolean
  crossfade: boolean
  notifications: boolean
}

export type ScheduleRepeat = "daily" | "weekly" | "once"
export type ScheduleStatus = "active" | "inactive"
export type Weekday =
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat"
  | "sun"

export interface ScheduleItem {
  id: number
  enabled: boolean
  time: string
  scenarioId: number
  scenarioName: string
  days: Weekday[]
  repeat: ScheduleRepeat
  nextRun: string
  status: ScheduleStatus
}

export interface ScheduleFormData {
  time: string
  scenarioId: number
  scenarioName: string
  days: Weekday[]
  repeat: ScheduleRepeat
  enabled: boolean
}

export interface AudioFile {
  id: EntityId
  name: string
  filename: string
  format: string
  sampleRate: number
  channels: number
  duration: number // seconds
  size: number // bytes
  createdAt: string
}

export type LogLevel = "INFO" | "WARNING" | "ERROR" | "DEBUG"

export type LogSource = "APP" | "API" | "AUDIO" | "UI" | "NETWORK"

export interface LogEntry {
  id: string
  timestamp: string
  time: string
  level: LogLevel
  source: LogSource
  event: string
  message: string
  context?: Record<string, unknown>
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
