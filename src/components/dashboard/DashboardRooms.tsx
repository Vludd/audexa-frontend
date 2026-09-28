import {
  AlertTriangle,
  Pause,
  Play,
  PlayCircle,
  Square,
  XCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Room } from "@/types"

interface DashboardRoomsProps {
  rooms: Room[]
  onNavigate: (page: string) => void
}

const MAX_VISIBLE_ROOMS = 6

function fmt(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(safeSeconds / 60)
  const sec = safeSeconds % 60

  return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

function getStatusPriority(status: Room["status"]) {
  switch (status) {
    case "error":
      return 0
    case "paused":
      return 1
    case "playing":
      return 2
    default:
      return 3
  }
}

function getRoomStatus(room: Room) {
  switch (room.status) {
    case "playing":
      return {
        label: "PLAYING",
        variant: "success" as const,
        icon: Play,
      }

    case "paused":
      return {
        label: "PAUSED",
        variant: "secondary" as const,
        icon: Pause,
      }

    case "error":
      return {
        label: "ERROR",
        variant: "destructive" as const,
        icon: XCircle,
      }

    default:
      return {
        label: "STOPPED",
        variant: "secondary" as const,
        icon: Square,
      }
  }
}

export default function DashboardRooms({
  rooms,
  onNavigate,
}: DashboardRoomsProps) {
  const activeRooms = rooms
    .filter(
      (room) =>
        room.status === "playing" ||
        room.status === "paused" ||
        room.status === "error",
    )
    .sort(
      (a, b) =>
        getStatusPriority(a.status) -
        getStatusPriority(b.status),
    )

  const visibleRooms = activeRooms.slice(0, MAX_VISIBLE_ROOMS)
  const hiddenRoomsCount = Math.max(
    0,
    activeRooms.length - MAX_VISIBLE_ROOMS,
  )

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold">
          Состояние комнат
          {activeRooms.length > 0 && (
            <span className="ml-1.5 text-muted-foreground">
              ({activeRooms.length})
            </span>
          )}
        </h3>

        <Button
          variant="link"
          className="h-auto p-0 text-xs"
          onClick={() => onNavigate("rooms")}
        >
          Все комнаты →
        </Button>
      </div>

      <div className="p-3.5">
        {activeRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <PlayCircle className="mb-2 size-7 text-muted-foreground/50" />

            <div className="text-sm text-muted-foreground">
              Нет активных комнат
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {visibleRooms.map((room, index) => {
              const status = getRoomStatus(room)
              const StatusIcon = status.icon

              return (
                <div key={room.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate("rooms")}
                    className="flex w-full min-w-0 items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted/60"
                  >
                    <span className="w-7 shrink-0 text-sm font-bold tabular-nums">
                      {String(room.id).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {room.name}
                      </div>

                      <div className="truncate text-xs text-muted-foreground">
                        {room.file}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {room.status === "playing" && (
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {fmt(room.position)}
                        </span>
                      )}

                      <Badge
                        variant={status.variant}
                        className="gap-1"
                      >
                        <StatusIcon className="size-3" />
                        {status.label}
                      </Badge>
                    </div>
                  </button>

                  {index < visibleRooms.length - 1 && (
                    <div className="h-px bg-border" />
                  )}
                </div>
              )
            })}

            {hiddenRoomsCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 w-full text-xs"
                onClick={() => onNavigate("rooms")}
              >
                Показать ещё {hiddenRoomsCount}{" "}
                {hiddenRoomsCount === 1
                  ? "комнату"
                  : hiddenRoomsCount < 5
                    ? "комнаты"
                    : "комнат"}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}