import type { RoomStatus } from "@/types"
import { Badge } from "@/components/ui/badge"

const CONFIG: Record<
  RoomStatus,
  {
    variant: "success" | "warning" | "secondary" | "destructive"
    dotClass: string
    label: string
  }
> = {
  playing: {
    variant: "success",
    dotClass: "bg-emerald-500",
    label: "Играет",
  },

  stopped: {
    variant: "secondary",
    dotClass: "bg-muted-foreground",
    label: "Остановлена",
  },

  waiting: {
    variant: "warning",
    dotClass: "bg-amber-500",
    label: "Ожидание",
  },

  error: {
    variant: "destructive",
    dotClass: "bg-red-500",
    label: "Ошибка",
  },
}

export default function StatusBadge({
  status,
}: {
  status: RoomStatus
}) {
  const config = CONFIG[status]

  return (
    <Badge
      variant={config.variant}
      className="gap-1.5"
    >
      <span
        className={`size-1.5 rounded-full ${config.dotClass}`}
      />

      {config.label}
    </Badge>
  )
}