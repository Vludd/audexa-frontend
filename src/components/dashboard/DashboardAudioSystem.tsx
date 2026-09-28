import { Badge } from "@/components/ui/badge"
import type { SystemStatus } from "@/types"

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
          Аудиосистема
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-3.5">
        <InfoRow
          label="Устройство"
          value={system.device}
        />

        <InfoRow
          label="Статус"
          value={
            <Badge
              variant={system.online ? "success" : "destructive"}
            >
              {system.online ? "ONLINE" : "OFFLINE"}
            </Badge>
          }
        />

        <InfoRow
          label="Выходы"
          value={system.outputs}
        />

        <InfoRow
          label="Частота"
          value={`${system.sampleRate / 1000} kHz`}
        />

        <InfoRow
          label="Буфер"
          value={`${system.bufferSize} samples`}
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