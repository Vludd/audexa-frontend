import Header from "@/components/Header"
import { t } from "@/i18n"

import AudioDeviceSettings from "@/components/settings/AudioDeviceSettings"
import LineMappingSettings from "@/components/settings/LineMappingSettings"
import StartupSettings from "@/components/settings/StartupSettings"
import LoggingSettings from "@/components/settings/LoggingSettings"
import SettingsActions from "@/components/settings/SettingsActions"
import LanguageSwitcher from "@/components/LanguageSwitcher"

export default function Settings() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header
        title={t("pages.settings.title")}
        subtitle={t("pages.settings.subtitle")}
      />

      <div className="min-h-0 flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 gap-3">
          <LineMappingSettings />
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 mt-3">
          <AudioDeviceSettings />

          <StartupSettings />
          <LoggingSettings />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-2">
          <LanguageSwitcher />
          <SettingsActions />
        </div>
      </div>
    </div>
  )
}