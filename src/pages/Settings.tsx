import Header from "@/components/Header"

import AudioDeviceSettings from "@/components/settings/AudioDeviceSettings"
import LineMappingSettings from "@/components/settings/LineMappingSettings"
import StartupSettings from "@/components/settings/StartupSettings"
import LoggingSettings from "@/components/settings/LoggingSettings"
import SettingsActions from "@/components/settings/SettingsActions"

export default function Settings() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header
        title="Настройки"
        subtitle="Конфигурация аудиосистемы и оборудования"
      />

      <div className="min-h-0 flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <AudioDeviceSettings />
          <LineMappingSettings />

          <StartupSettings />
          <LoggingSettings />
        </div>

        <div className="mt-3">
          <SettingsActions />
        </div>
      </div>
    </div>
  )
}