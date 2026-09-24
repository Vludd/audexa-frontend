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
  idle: {
    variant: "secondary",
    dotClass: "bg-muted-foreground",
    label: "Готово",
  },

  playing: {
    variant: "success",
    dotClass: "bg-emerald-500",
    label: "Играет",
  },

  paused: {
    variant: "warning",
    dotClass: "bg-amber-500",
    label: "Пауза",
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

interface Props {
  status: RoomStatus
}

export default function StatusBadge({ status }: Props) {
  const config = CONFIG[status]

  return (
    <Badge variant={config.variant} className="gap-1.5">
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${config.dotClass}`}
      />

      {config.label}
    </Badge>
  )
}
