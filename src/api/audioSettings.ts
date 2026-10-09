import { apiRequest } from "@/api/client"

export interface AudioOutputMapping {
  roomId: string
  outputId: string | null
}

export interface AudioSettingsConfig {
  version: 1
  deviceId: string | null
  mappings: AudioOutputMapping[]
  translationOutputId: string | null
}

const STORAGE_KEY = "audexa.audio-settings"

const DEFAULT_CONFIG: AudioSettingsConfig = {
  version: 1,
  deviceId: null,
  mappings: [],
  translationOutputId: null,
}

function readLocalConfig(): AudioSettingsConfig {
  if (typeof window === "undefined") {
    return DEFAULT_CONFIG
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONFIG

    const parsed = JSON.parse(raw) as Partial<AudioSettingsConfig>

    return {
      version: 1,
      deviceId:
        typeof parsed.deviceId === "string"
          ? parsed.deviceId
          : null,
      mappings: Array.isArray(parsed.mappings)
        ? parsed.mappings.filter(
            (mapping): mapping is AudioOutputMapping =>
              Boolean(mapping) &&
              typeof mapping.roomId === "string" &&
              (typeof mapping.outputId === "string" || mapping.outputId === null),
          )
        : [],
      translationOutputId:
        typeof parsed.translationOutputId === "string"
          ? parsed.translationOutputId
          : null,
    }
  } catch {
    return DEFAULT_CONFIG
  }
}

function writeLocalConfig(config: AudioSettingsConfig) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

function isNetworkFailure(error: unknown): boolean {
  return (
    error instanceof TypeError ||
    (error instanceof DOMException && (error.name === "AbortError" || error.name === "TimeoutError"))
  )
}

export const audioSettingsApi = {
  async get(): Promise<AudioSettingsConfig> {
    try {
      const config = await apiRequest<AudioSettingsConfig>(
        "/api/settings/audio",
      )
      writeLocalConfig(config)
      return config
    } catch (error) {
      // Keep the local copy only when the backend itself is unreachable.
      // HTTP validation errors must reach the UI instead of being silently
      // converted into a successful local save.
      if (!isNetworkFailure(error)) throw error
      return readLocalConfig()
    }
  },

  async save(config: AudioSettingsConfig): Promise<AudioSettingsConfig> {
    try {
      const saved = await apiRequest<AudioSettingsConfig>(
        "/api/settings/audio",
        {
          method: "PUT",
          body: JSON.stringify(config),
        },
      )
      writeLocalConfig(saved)
      return saved
    } catch (error) {
      // Backend validation/conflict errors must not be swallowed. The local
      // fallback is only useful when the backend cannot be reached at all.
      if (!isNetworkFailure(error)) throw error
      writeLocalConfig(config)
      return config
    }
  },

  readLocal: readLocalConfig,
}
