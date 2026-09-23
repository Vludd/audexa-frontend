import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { ScheduleItem } from "@/types"

interface Props {
  schedule: ScheduleItem[]
  onToggle: (id: number) => void
}

export default function ScheduleTable({
  schedule,
  onToggle,
}: Props) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-16">
              Вкл.
            </TableHead>
            <TableHead>Время</TableHead>
            <TableHead>Сценарий</TableHead>
            <TableHead>Дни</TableHead>
            <TableHead>Повтор</TableHead>
            <TableHead>Следующий запуск</TableHead>
            <TableHead>Статус</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {schedule.map((item) => {
            const active = item.status === "active"

            return (
              <TableRow key={item.id}>
                <TableCell>
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={() => onToggle(item.id)}
                    aria-label={`Включить расписание ${item.id}`}
                  />
                </TableCell>

                <TableCell className="text-base font-bold">
                  {item.time}
                </TableCell>

                <TableCell className="font-medium">
                  {item.scenarioName}
                </TableCell>

                <TableCell className="text-sm">
                  {item.days.length === 7
                    ? "Пн – Вс"
                    : item.days.join(", ")}
                </TableCell>

                <TableCell className="text-sm">
                  {item.repeat === "daily"
                    ? "Ежедневно"
                    : item.repeat === "weekly"
                      ? "Еженедельно"
                      : "Однократно"}
                </TableCell>

                <TableCell className="text-xs text-muted-foreground">
                  {item.nextRun}
                </TableCell>

                <TableCell>
                  <span
                    className={
                      active
                        ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                        : "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    }
                  >
                    <span className="text-[9px]">
                      {active ? "●" : "○"}
                    </span>

                    {active ? "Активно" : "Отключено"}
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}