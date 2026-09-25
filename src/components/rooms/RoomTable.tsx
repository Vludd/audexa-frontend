import {
  Copy,
  Edit,
  Ellipsis,
  Loader2,
  Pause,
  Play,
  SkipForward,
  Square,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { Room } from "@/types"
import type { RoomOperation } from "@/hooks/useRooms"

import StatusBadge from "@/components/StatusBadge"
import { Slider } from "../ui/slider"
import { formatTime, getProgress } from "@/lib/audio"

interface Props {
  rooms: Room[]
  operations?: Record<number, RoomOperation>

  onPlay: (id: number) => void
  onStop: (id: number) => void
  onPause: (id: number) => void

  onEdit: (room: Room) => void
  onDuplicate: (room: Room) => void
  onDelete: (room: Room) => void

  onVolumeChange: (id: number, volume: number) => void
}

export default function RoomTable({
  rooms,
  operations,
  onPlay,
  onStop,
  onPause,
  onEdit,
  onDuplicate,
  onDelete,
  onVolumeChange
}: Props) {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">#</TableHead>
            <TableHead>Комната</TableHead>
            <TableHead className="w-16">Статус</TableHead>
            <TableHead>Файл</TableHead>
            <TableHead>Громкость</TableHead>
            <TableHead className="w-72">Действия</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {rooms.map((room) => {
            const operation = operations?.[room.id]
            const isPending = Boolean(operation)

            return (
              <TableRow key={room.id}>
                <TableCell className="font-bold min-w-[32px] text-center">
                  {String(room.id).padStart(2, "0")}
                </TableCell>

                <TableCell className="font-medium">
                  <div className="mb-1">
                    {room.name}
                  </div>

                  <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{formatTime(room.position)}</span>

                    <span>{formatTime(room.duration)}</span>
                  </div>

                  <div
                    className="mb-2 h-1.5 overflow-hidden rounded-full bg-muted-foreground/25"
                    role="progressbar"
                    aria-label={`Прогресс воспроизведения комнаты ${room.id}`}
                    aria-valuemin={0}
                    aria-valuemax={room.duration}
                    aria-valuenow={room.position}
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-200"
                      style={{
                        width: `${getProgress(room.position, room.duration)}%`,
                      }}
                    />
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={room.status} />
                  </div>
                </TableCell>

                <TableCell className="max-w-[280px]">
                  <span
                    className="block truncate text-xs text-muted-foreground"
                    title={room.file}
                  >
                    {room.file}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex min-w-[150px] items-center gap-3">
                    <Slider
                      trackClassName="bg-muted-foreground/25"
                      value={[room.volume]}
                      min={0}
                      max={100}
                      step={1}
                      disabled={isPending}
                      onValueChange={(value) => {
                        const volume = Array.isArray(value)
                          ? value[0]
                          : value

                        if (typeof volume === "number") {
                          onVolumeChange(room.id, volume)
                        }
                      }}
                      aria-label={`Громкость комнаты ${room.name}`}
                      className="w-24"
                    />

                    <span className="min-w-9 text-right text-xs font-medium tabular-nums">
                      {room.volume}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    {operation === "starting" ? (
                      <SmallButton
                        label="Запуск..."
                        variant="success"
                        disabled
                        icon={
                          <Loader2 className="size-3 animate-spin" />
                        }
                      />
                    ) : operation === "pausing" ? (
                      <SmallButton
                        label="Пауза..."
                        variant="primary"
                        disabled
                        icon={
                          <Loader2 className="size-3 animate-spin" />
                        }
                      />
                    ) : room.status === "playing" ? (
                      <SmallButton
                        label="Пауза"
                        variant="primary"
                        onClick={() => onPause(room.id)}
                        disabled={isPending}
                        icon={<Pause className="size-3" />}
                      />
                    ) : room.status === "paused" ? (
                      <SmallButton
                        label="Продолжить"
                        variant="success"
                        onClick={() => onPlay(room.id)}
                        disabled={isPending}
                        icon={
                          <Play className="size-3" />
                        }
                      />
                    ) : (
                      <SmallButton
                        label="Запуск"
                        variant="success"
                        onClick={() => onPlay(room.id)}
                        disabled={isPending}
                        icon={<Play className="size-3" />}
                      />
                    )}

                    {operation === "stopping" ? (
                      <SmallButton
                        label="Остановка..."
                        variant="secondary"
                        disabled
                        icon={
                          <Loader2 className="size-3 animate-spin" />
                        }
                      />
                    ) : (
                      <SmallButton
                        label="Стоп"
                        variant="secondary"
                        onClick={() => onStop(room.id)}
                        disabled={
                          isPending ||
                          (room.status !== "playing" &&
                            room.status !== "paused")
                        }
                        icon={
                          <Square className="size-3" />
                        }
                      />
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label={`Действия для комнаты ${room.name}`}
                        >
                          <Ellipsis className="size-4" />
                        </Button>
                      }
                    />

                    <DropdownMenuContent
                      align="end"
                      className="w-48"
                    >
                      <DropdownMenuItem
                        onClick={() => onEdit(room)}
                      >
                        <Edit className="size-4" />
                        Редактировать
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onDuplicate(room)}
                      >
                        <Copy className="size-4" />
                        Дублировать
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDelete(room)}
                      >
                        <Trash2 className="size-4" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}

function SmallButton({
  label,
  variant,
  onClick,
  disabled = false,
  icon,
}: {
  label: string
  variant: "primary" | "success" | "secondary"
  onClick?: () => void
  disabled?: boolean
  icon?: React.ReactNode
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={
        variant === "success"
          ? "success"
          : variant === "primary"
            ? "default"
            : "secondary"
      }
      onClick={onClick}
      disabled={disabled}
      className="gap-1.5"
    >
      {icon}
      {label}
    </Button>
  )
}
