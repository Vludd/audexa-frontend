import type { ReactNode } from "react"
import {
  MoreHorizontal,
  Pause,
  Play,
  Settings,
  Square,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import type { Room } from "@/types"
import StatusBadge from "@/components/StatusBadge"
import { cn } from "cn"

interface Props {
  room: Room
  onPlay: (id: number) => void
  onStop: (id: number) => void
  onPause: (id: number) => void
  onVolumeChange: (id: number, volume: number) => void
}

export default function RoomCard({
  room,
  onPlay,
  onStop,
  onPause,
  onVolumeChange,
}: Props) {
  const isPlaying = room.status === "playing"

  return (
    <Card
      className={cn(
        "transition-all border-1",
        isPlaying && "border-emerald-500 bg-emerald-50",

        room.status === "error" && "border-destructive/50",
        room.status === "waiting" && "border-amber-400/70",
      )}
    >
      <CardContent className="p-3.5">
        <div className="mb-2.5 flex items-start justify-between">
          <div className="min-w-0">
            <div className="text-2xl font-bold leading-none">
              {String(room.id).padStart(2, "0")}
            </div>

            <div className="mt-1 truncate text-sm font-semibold">
              {room.name}
            </div>

            <div className="mt-1.5">
              <StatusBadge status={room.status} />
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-muted-foreground"
            aria-label="Дополнительные действия"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </div>

        <div
          className="mb-2.5 truncate text-[11px] text-muted-foreground"
          title={room.file}
        >
          {room.file}
        </div>

        <div className="mb-2.5 flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={100}
            value={room.volume}
            onChange={(event) =>
              onVolumeChange(room.id, Number(event.target.value))
            }
            className="h-1 w-full cursor-pointer accent-primary"
            aria-label={`Громкость комнаты ${room.id}`}
          />

          <span className="min-w-8 text-right text-xs font-medium">
            {room.volume}%
          </span>
        </div>

        <div className="flex gap-1.5">
          {isPlaying ? (
            <ActionButton
              icon={<Pause className="size-3" />}
              label="Пауза"
              variant="primary"
              onClick={() => onPause(room.id)}
            />
          ) : (
            <ActionButton
              icon={<Play className="size-3" />}
              label="Запуск"
              variant="success"
              onClick={() => onPlay(room.id)}
            />
          )}

          <ActionButton
            icon={<Square className="size-3" />}
            label="Стоп"
            variant="secondary"
            onClick={() => onStop(room.id)}
          />

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0"
            aria-label={`Настройки комнаты ${room.id}`}
          >
            <Settings className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ActionButton({
  icon,
  label,
  variant,
  onClick,
}: {
  icon: ReactNode
  label: string
  variant: "primary" | "success" | "secondary"
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={
        variant === "success"
          ? "success"
          : variant === "secondary"
            ? "secondary"
            : "default"
      }
      onClick={onClick}
      className="flex-1 gap-1.5"
    >
      {icon}
      {label}
    </Button>
  )
}