import { useCallback, useEffect, useMemo, useState } from "react"

import Header from "@/components/Header"
import { t } from "@/i18n"

import AudioDeviceSettings from "@/components/settings/AudioDeviceSettings"
import LineMappingSettings from "@/components/settings/LineMappingSettings"
import StartupSettings from "@/components/settings/StartupSettings"
import LoggingSettings from "@/components/settings/LoggingSettings"
import SettingsActions from "@/components/settings/SettingsActions"
import ThemeSettings from "@/components/settings/ThemeSettings"
import LanguageSwitcher from "@/components/LanguageSwitcher"

import {
  audioDevicesApi,
  type AudioDevice,
} from "@/api/audioDevices"
import type { Room } from "@/types"

interface SettingsProps {
  rooms: Room[]
}

function SettingsSection({
  title,
  description,
  children,
  className = "",
}: {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`space-y-2 ${className}`}>
      <div>
        <h2 className="text-sm font-semibold tracking-tight">
          {title}
        </h2>

        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  )
}

export default function Settings({ rooms }: SettingsProps) {
  const [devices, setDevices] = useState<AudioDevice[]>([])
  const [selectedDeviceId, setSelectedDeviceId] =
    useState("")

  const [isLoadingDevices, setIsLoadingDevices] =
    useState(true)

  const [devicesError, setDevicesError] =
    useState<string | null>(null)

  const [devicesSupported, setDevicesSupported] =
    useState(true)

  const selectedDevice = useMemo(
    () =>
      devices.find(
        (device) => device.id === selectedDeviceId,
      ) ?? null,
    [devices, selectedDeviceId],
  )

  const applyDevicesResponse = useCallback(
    (response: Awaited<ReturnType<typeof audioDevicesApi.getAll>>) => {
      setDevices(response.devices)
      setDevicesSupported(response.supported)

      setSelectedDeviceId((current) => {
        if (
          current &&
          response.devices.some(
            (device) => device.id === current,
          )
        ) {
          return current
        }

        const onlineDevice =
          response.devices.find(
            (device) => device.status === "online",
          )

        return (
          onlineDevice?.id ??
          response.devices[0]?.id ??
          ""
        )
      })

      setDevicesError(
        response.error && response.devices.length === 0
          ? response.error
          : null,
      )
    },
    [],
  )

  const applyDevicesError = useCallback((error: unknown) => {
    setDevices([])
    setSelectedDeviceId("")
    setDevicesError(
      error instanceof Error
        ? error.message
        : "Не удалось получить аудиоустройства",
    )
  }, [])

  const fetchDevices = useCallback(async () => {
    setIsLoadingDevices(true)
    setDevicesError(null)

    try {
      const response =
        await audioDevicesApi.getAll()

      applyDevicesResponse(response)
    } catch (error) {
      applyDevicesError(error)
    } finally {
      setIsLoadingDevices(false)
    }
  }, [applyDevicesError, applyDevicesResponse])

  useEffect(() => {
    let cancelled = false

    audioDevicesApi.getAll()
      .then((response) => {
        if (!cancelled) {
          applyDevicesResponse(response)
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          applyDevicesError(error)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingDevices(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [applyDevicesError, applyDevicesResponse])

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header
        title={t("pages.settings.title")}
        subtitle={t("pages.settings.subtitle")}
      />

      <main className="min-h-0 flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-6xl space-y-6">
          <SettingsSection
            title={t("settings.sections.general.title")}
            description={t(
              "settings.sections.general.description",
            )}
          >
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              <LanguageSwitcher />
              <ThemeSettings />
            </div>
          </SettingsSection>

          <SettingsSection
            title={t("settings.sections.application.title")}
            description={t(
              "settings.sections.application.description",
            )}
          >
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              <StartupSettings />
              <LoggingSettings />
            </div>
          </SettingsSection>

          <SettingsSection
            title={t("settings.sections.audio.title")}
            description={t(
              "settings.sections.audio.description",
            )}
          >
            <AudioDeviceSettings
              devices={devices}
              selectedDeviceId={selectedDeviceId}
              onDeviceChange={setSelectedDeviceId}
              isLoading={isLoadingDevices}
              supported={devicesSupported}
              error={devicesError}
              onRefresh={() => void fetchDevices()}
            />
          </SettingsSection>

          <SettingsSection
            title={t(
              "settings.sections.outputMapping.title",
            )}
            description={t(
              "settings.sections.outputMapping.description",
            )}
          >
            <LineMappingSettings
              key={
                `${selectedDevice?.id ?? "no-device"}:${selectedDevice?.outputs
                  .map((output) => output.id)
                  .join("|") ?? ""}:${rooms
                  .map((room) => room.id)
                  .join("|")}`
              }
              rooms={rooms}
              selectedDevice={selectedDevice}
            />
          </SettingsSection>

          <SettingsSection
            title={t("settings.sections.actions.title")}
            description={t(
              "settings.sections.actions.description",
            )}
          >
            <SettingsActions />
          </SettingsSection>
        </div>
      </main>
    </div>
  )
}