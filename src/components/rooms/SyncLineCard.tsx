import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import type { Room } from "@/types"
import StatusBadge from "@/components/StatusBadge"

interface Props {
  room: Room
  onPlay: (id: number) => void
  onStop: (id: number) => void
}

export default function SyncLineCard({
  room,
  onPlay,
  onStop,
}: Props) {
  return (
    <Card className="mt-5 border-primary/40">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <span className="text-base font-bold text-primary">
            31
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold">
            Синхронный перевод
          </div>

          <div className="mt-1.5">
            <StatusBadge status={room.status} />
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="success"
          onClick={() => onPlay(31)}
        >
          Запуск
        </Button>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => onStop(31)}
        >
          Стоп
        </Button>
      </CardContent>
    </Card>
  )
}