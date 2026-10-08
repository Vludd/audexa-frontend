import { Badge } from "@/components/ui/badge"
import type { SystemStatus } from "@/types"
import { t } from "@/i18n"

interface DashboardAudioSystemProps {
  system: SystemStatus
}

export default function DashboardAudioSystem({
  system,
}: DashboardAudioSystemProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center border-b px-4 py-3">
        <h3 className="text-sm font-semibold">
          {t("dashboard.audioSystem.title")}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-3.5">
        <InfoRow
          label={t("dashboard.audioSystem.device")}
          value={system.device}
        />

        <InfoRow
          label={t("dashboard.audioSystem.status")}
          value={
            <Badge
              variant={system.online ? "success" : "destructive"}
            >
              {system.online ? "ONLINE" : "OFFLINE"}
            </Badge>
          }
        />

        <InfoRow
          label={t("dashboard.audioSystem.outputs")}
          value={system.outputs}
        />

        <InfoRow
          label={t("dashboard.audioSystem.frequency")}
          value={`${system.sampleRate / 1000} ${t("units.kilohertz")}`}
        />

        <InfoRow
          label={t("dashboard.audioSystem.buffer")}
          value={`${system.bufferSize} ${t("dashboard.audioSystem.samples")}`}
        />
      </div>
    </div>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="min-w-0">
      <div className="mb-0.5 text-[11px] text-muted-foreground">
        {label}
      </div>

      <div className="truncate text-sm font-medium">
        {value}
      </div>
    </div>
  )
}