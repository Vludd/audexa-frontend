import Header from "@/components/Header"
import { t } from "@/i18n"

import AudioDeviceSettings from "@/components/settings/AudioDeviceSettings"
import LineMappingSettings from "@/components/settings/LineMappingSettings"
import StartupSettings from "@/components/settings/StartupSettings"
import LoggingSettings from "@/components/settings/LoggingSettings"
import SettingsActions from "@/components/settings/SettingsActions"
import LanguageSwitcher from "@/components/LanguageSwitcher"

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
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>

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

export default function Settings() {
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
            description={t("settings.sections.general.description")}
          >
            <div className="max-w-xl">
              <LanguageSwitcher />
            </div>
          </SettingsSection>

          <SettingsSection
            title={t("settings.sections.application.title")}
            description={t("settings.sections.application.description")}
          >
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              <StartupSettings />
              <LoggingSettings />
            </div>
          </SettingsSection>

          <SettingsSection
            title={t("settings.sections.audio.title")}
            description={t("settings.sections.audio.description")}
          >
            <AudioDeviceSettings />
          </SettingsSection>

          <SettingsSection
            title={t("settings.sections.outputMapping.title")}
            description={t("settings.sections.outputMapping.description")}
          >
            <LineMappingSettings />
          </SettingsSection>

          <SettingsSection
            title={t("settings.sections.actions.title")}
            description={t("settings.sections.actions.description")}
          >
            <SettingsActions />
          </SettingsSection>
        </div>
      </main>
    </div>
  )
}