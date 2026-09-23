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
import StatusBadge from "@/components/StatusBadge"

interface Props {
  rooms: Room[]
  onPlay: (id: number) => void
  onStop: (id: number) => void
  onPause: (id: number) => void
}

export default function RoomTable({
  rooms,
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
            <TableHead>Статус</TableHead>
            <TableHead>Файл</TableHead>
            <TableHead>Громкость</TableHead>
            <TableHead className="w-48">Действия</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell className="font-bold">
                {String(room.id).padStart(2, "0")}
              </TableCell>

              <TableCell className="font-medium">
                {room.name}
              </TableCell>

              <TableCell>
                <StatusBadge status={room.status} />
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
                  {room.status === "playing" ? (
                    <SmallButton
                      label="Пауза"
                      variant="primary"
                      onClick={() => onPause(room.id)}
                    />
                  ) : (
                    <SmallButton
                      label="Запуск"
                      variant="success"
                      onClick={() => onPlay(room.id)}
                    />
                  )}

                  <SmallButton
                    label="Стоп"
                    variant="secondary"
                    onClick={() => onStop(room.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

function SmallButton({
  label,
  variant,
  onClick,
}: {
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
          : variant === "primary"
            ? "default"
            : "secondary"
      }
      onClick={onClick}
    >
      {label}
    </Button>
  )
}