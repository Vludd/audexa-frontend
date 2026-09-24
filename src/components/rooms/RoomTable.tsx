import { Loader2, Pause, Play, SkipForward, Square } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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

interface Props {
  rooms: Room[]
  operations?: Record<number, RoomOperation>

  onPlay: (id: number) => void
  onStop: (id: number) => void
  onPause: (id: number) => void
}

export default function RoomTable({
  rooms,
  operations,
  onPlay,
  onStop,
  onPause,
}: Props) {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>Комната</TableHead>
            <TableHead className="w-16">Статус</TableHead>
            <TableHead>Файл</TableHead>
            <TableHead>Громкость</TableHead>
            <TableHead className="w-72">Действия</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rooms.map((room) => {
            const operation = operations?.[room.id]
            const isPending = Boolean(operation)

            return (
              <TableRow key={room.id}>
                <TableCell className="font-bold">
                  {String(room.id).padStart(2, "0")}
                </TableCell>

                <TableCell className="font-medium">
                  {room.name}
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
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-[width]"
                        style={{ width: `${room.volume}%` }}
                      />
                    </div>

                    <span className="text-xs font-medium">
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
                        icon={<Loader2 className="size-3 animate-spin" />}
                      />
                    ) : operation === "pausing" ? (
                      <SmallButton
                        label="Пауза..."
                        variant="primary"
                        disabled
                        icon={<Loader2 className="size-3 animate-spin" />}
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
                        icon={<SkipForward className="size-3" />}
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
                        icon={<Loader2 className="size-3 animate-spin" />}
                      />
                    ) : (
                      <SmallButton
                        label="Стоп"
                        variant="secondary"
                        onClick={() => onStop(room.id)}
                        disabled={
                          isPending ||
                          (room.status !== "playing" && room.status !== "paused")
                        }
                        icon={<Square className="size-3" />}
                      />
                    )}
                  </div>
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