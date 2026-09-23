import { Clock, Play, Square } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import type { ScheduleItem } from "@/types"

interface Props {
  items: ScheduleItem[]
}

export default function UpcomingEvents({
  items,
}: Props) {
  return (
    <aside className="w-[240px] shrink-0 overflow-auto border-l bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-semibold">
          Ближайшие события
        </div>

        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs"
        >
          Все события
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex gap-3"
          >
            <div className="flex flex-col items-center pt-1">
              <span className="size-2.5 shrink-0 rounded-full bg-primary" />

              {index < items.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-border" />
              )}
            </div>

            <div className="min-w-0 pb-1">
              <div className="text-sm font-bold">
                {item.time}
              </div>

              <div className="truncate text-xs font-medium">
                {item.scenarioName}
              </div>

              <div className="mt-0.5 text-[11px] text-muted-foreground">
                Сегодня
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="mb-3 text-sm font-semibold">
        Быстрые действия
      </div>

      <div className="space-y-2">
        <Button
          type="button"
          variant="success"
          className="w-full justify-start"
        >
          <Play
            className="size-4"
            fill="currentColor"
          />
          Запустить сейчас
        </Button>

        <Button
          type="button"
          variant="destructive"
          className="w-full justify-start"
        >
          <Square
            className="size-4"
            fill="currentColor"
          />
          Остановить всё
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
        >
          <Clock className="size-4" />
          Тест расписания
        </Button>
      </div>
    </aside>
  )
}